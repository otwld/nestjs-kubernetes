import { ModuleMetadata, Provider, Type } from '@nestjs/common';
import {
  Cluster,
  ConfigOptions,
  User,
} from '@kubernetes/client-node/dist/config_types';
import { LoadFrom } from './load-from.enum';

export type KubernetesProviderOptions = LoadFromOptions & {
  name: string | symbol;
  loadFrom: LoadFrom;
};

export type KubernetesModuleOptions =
  | Array<KubernetesProviderOptions>
  | {
      servers: Array<KubernetesProviderOptions>;
      isGlobal?: boolean;
    };

export interface KubernetesModuleOptionsFactory {
  createKubernetesOptions():
    | Promise<LoadFromOptions>
    | LoadFromOptions;
}

export interface KubernetesProviderAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  useExisting?: Type<KubernetesModuleOptionsFactory>;
  useClass?: Type<KubernetesModuleOptionsFactory>;
  useFactory?: (
    ...args: any[]
  ) => Promise<LoadFromOptions> | LoadFromOptions;
  inject?: any[];
  extraProviders?: Provider[];
  name: string | symbol;
}

export type KubernetesModuleAsyncOptions =
  | Array<KubernetesProviderAsyncOptions>
  | {
      servers: Array<KubernetesProviderAsyncOptions>;
      isGlobal?: boolean;
    };

export type LoadFromOptions =
  | LoadFromFileOptions
  | LoadFromStringOptions
  | LoadFromClusterOptions
  | LoadFromDefaultOptions
  | LoadFromOptionsOptions
  | LoadFromClusterAndUserOptions;

export interface LoadFromFileOptions {
  loadFrom: LoadFrom.FILE;
  opts: Partial<ConfigOptions> & {
    file: string;
    context?: string
  };
}

export interface LoadFromClusterOptions {
  loadFrom: LoadFrom.CLUSTER;
  opts?: {
    pathPrefix?: string;
    context?: string
  };
}

export interface LoadFromStringOptions {
  loadFrom: LoadFrom.STRING;
  opts: Partial<ConfigOptions> & {
    config: string;
    context?: string
  };
}

export interface LoadFromOptionsOptions {
  loadFrom: LoadFrom.OPTIONS;
  opts?: any & {
    context?: string
  };
}

export interface LoadFromDefaultOptions {
  loadFrom: LoadFrom.DEFAULT;
  opts?: Partial<ConfigOptions> & {
    contextFromStartingConfig?: boolean;
    context?: string
  };
}

export interface LoadFromClusterAndUserOptions {
  loadFrom: LoadFrom.CLUSTER_AND_USER;
  opts: {
    cluster: Cluster;
    user: User;
    context?: string
  };
}
