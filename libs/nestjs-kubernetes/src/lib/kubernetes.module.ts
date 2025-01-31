import {
  DynamicModule,
  ForwardReference,
  Module,
  Provider,
  Type,
} from '@nestjs/common';
import {
  KubernetesModuleAsyncOptions,
  KubernetesModuleOptions,
  KubernetesModuleOptionsFactory,
  KubernetesProviderAsyncOptions,
  KubernetesProviderOptions,
} from './kubernetes-options.interface';
import { KubernetesFactory } from './kubernetes.factory';
import { KUBERNETES_CONNECTION } from './kubernetes.constants';

@Module({
  controllers: [],
  providers: [],
  exports: [],
})
export class KubernetesModule {
  static register(options: KubernetesModuleOptions): DynamicModule {
    const serversOptions: KubernetesProviderOptions[] = !Array.isArray(options)
      ? options.servers
      : options;
    const servers = (serversOptions || []).map(
      (item: KubernetesProviderOptions) => {
        return {
          provide: item.name || KUBERNETES_CONNECTION,
          useValue: KubernetesFactory.create(item),
        };
      }
    );
    return {
      module: KubernetesModule,
      global: !Array.isArray(options) && options.isGlobal,
      providers: servers,
      exports: servers,
    };
  }

  static registerAsync(options: KubernetesModuleAsyncOptions): DynamicModule {
    const serversOptions = !Array.isArray(options) ? options.servers : options;
    const providers: Provider[] = serversOptions.reduce(
      (accProviders: Provider[], item) =>
        accProviders
          .concat(this.createAsyncProviders(item))
          .concat(item.extraProviders || []),
      []
    );
    const imports = serversOptions.reduce((accImports, option) => {
      if (!option.imports) {
        return accImports;
      }
      const toInsert = option.imports.filter(
        (item) => !accImports.includes(item)
      );
      return accImports.concat(toInsert);
    }, [] as Array<DynamicModule | Promise<DynamicModule> | ForwardReference | Type>);
    return {
      module: KubernetesModule,
      global: !Array.isArray(options) && options.isGlobal,
      imports,
      providers: providers,
      exports: providers,
    };
  }

  private static createAsyncProviders(
    options: KubernetesProviderAsyncOptions
  ): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }
    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: options.useClass!,
        useClass: options.useClass!,
      },
    ];
  }

  private static createAsyncOptionsProvider(
    options: KubernetesProviderAsyncOptions
  ): Provider {
    if (options.useFactory) {
      return {
        provide: options.name || KUBERNETES_CONNECTION,
        useFactory: this.createFactoryWrapper(options.useFactory),
        inject: options.inject || [],
      };
    }
    return {
      provide: options.name || KUBERNETES_CONNECTION,
      useFactory: this.createFactoryWrapper(
        (optionsFactory: KubernetesModuleOptionsFactory) =>
          optionsFactory.createKubernetesOptions()
      ),
      inject: [options.useExisting || options.useClass!],
    };
  }

  private static createFactoryWrapper(
    useFactory: KubernetesProviderAsyncOptions['useFactory']
  ) {
    return async (...args: any[]) => {
      const clientOptions = await useFactory!(...args);
      return KubernetesFactory.create(clientOptions);
    };
  }
}
