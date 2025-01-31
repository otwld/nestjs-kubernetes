import {
  KubernetesProviderOptions,
  LoadFromOptions,
} from './kubernetes-options.interface';
import { KubeConfig } from '@kubernetes/client-node';
import { LoadFrom } from './load-from.enum';

export interface IKubernetesFactory {
  create(clientOptions: KubernetesProviderOptions): KubeConfig;
}

export class KubernetesFactory {
  /*public static create(
    options: { loadFrom: LoadFrom.FILE } & KubernetesProviderOptions
  ): KubeConfig;
  public static create(
    options: { loadFrom: LoadFrom.CLUSTER } & KubernetesProviderOptions
  ): KubeConfig;
  public static create(
    options: { loadFrom: LoadFrom.STRING } & KubernetesProviderOptions
  ): KubeConfig;
  public static create(
    options: { loadFrom: LoadFrom.OPTIONS } & KubernetesProviderOptions
  ): KubeConfig;
  public static create(
    options: { loadFrom: LoadFrom.DEFAULT } & KubernetesProviderOptions
  ): KubeConfig;
  public static create(
    options: { loadFrom: LoadFrom.CLUSTER_AND_USER } & KubernetesProviderOptions
  ): KubeConfig;*/
  public static create(options: LoadFromOptions): KubeConfig {
    const kubeConfig: KubeConfig = new KubeConfig();
    switch (options.loadFrom) {
      case LoadFrom.FILE:
        kubeConfig.loadFromFile(options.opts.file, options.opts);
        if (options.opts?.context) {
          kubeConfig.setCurrentContext(options.opts.context);
        }
        return kubeConfig;
      case LoadFrom.CLUSTER:
        kubeConfig.loadFromCluster(options?.opts?.pathPrefix);
        if (options?.opts?.context) {
          kubeConfig.setCurrentContext(options.opts.context);
        }
        return kubeConfig;
      case LoadFrom.STRING:
        kubeConfig.loadFromString(options.opts.config, options.opts);
        if (options.opts?.context) {
          kubeConfig.setCurrentContext(options.opts.context);
        }
        return kubeConfig;
      case LoadFrom.DEFAULT:
        kubeConfig.loadFromDefault(
          options.opts,
          options?.opts?.contextFromStartingConfig,
        );
        if (options?.opts?.context) {
          kubeConfig.setCurrentContext(options.opts.context);
        }
        return kubeConfig;
      case LoadFrom.OPTIONS:
        kubeConfig.loadFromOptions(options?.opts);
        if (options?.opts?.context) {
          kubeConfig.setCurrentContext(options.opts.context);
        }
        return kubeConfig;
      case LoadFrom.CLUSTER_AND_USER:
        kubeConfig.loadFromClusterAndUser(
          options.opts.cluster,
          options.opts.user,
        );
        if (options.opts?.context) {
          kubeConfig.setCurrentContext(options.opts.context);
        }
        return kubeConfig;
      default:
        kubeConfig.loadFromCluster();
        return kubeConfig;
    }
  }
}
