# NestJS Kubernetes

![otwld_nestjs_kubernetes_banner](./banner.png)

![GitHub License](https://img.shields.io/github/license/otwld/nestjs-kubernetes)
![Build Status](https://github.com/otwld/nestjs-kubernetes/actions/workflows/cd.yml/badge.svg)
[![Discord](https://img.shields.io/badge/Discord-OTWLD-blue?logo=discord&logoColor=white)](https://discord.gg/U24mpqTynB)
![NPM Downloads](https://img.shields.io/npm/dw/%40otwld%2Fnestjs-kubernetes)


- [Installation](#installation)
- [Usage](#usage)
  - [Register from KubeConfig file](#register-from-KubeConfig-file)
  - [Register in cluster](#register-in-cluster)
  - [Register multi cluster](#register-multi-cluster)
- [Injecting KubeConfig](#injecting-kubeconfig)
- [Support](#support)

## Installation

```bash
yarn add @otwld/nestjs-kubernetes @kubernetes/client-node
```

```bash
npm install @otwld/nestjs-kubernetes @kubernetes/client-node
```

## Usage

### Register from KubeConfig file

```typescript
import { Module } from '@nestjs/common';
import { KubernetesModule, LoadFrom } from '@otwld/nestjs-kubernetes';

@Module({
  imports: [KubernetesModule.register({
    servers: [
      {
        name: 'KUBE_CLUSTER',
        loadFrom: LoadFrom.FILE,
        opts: {
          file: '/path/to/kubeconfig',
          context: 'cluster-1'
        }
      }
    ],
    isGlobal: true
  })]
})
export class AppModule {
}
```

### Register in cluster

```typescript
import { Module } from '@nestjs/common';
import { KubernetesModule, LoadFrom } from '@otwld/nestjs-kubernetes';

@Module({
  imports: [KubernetesModule.register({
    servers: [
      {
        name: 'KUBE_CLUSTER',
        loadFrom: LoadFrom.CLUSTER
      }
    ], 
    isGlobal: true
  })]
})
export class AppModule {
}
```

### Register multi cluster

```typescript
import { Module } from '@nestjs/common';
import { KubernetesModule, LoadFrom } from '@otwld/nestjs-kubernetes';

@Module({
  imports: [KubernetesModule.register({
    servers: [
      {
        name: 'KUBE_CLUSTER_1',
        loadFrom: LoadFrom.FILE,
        opts: {
          file: '/path/to/kubeconfig',
          context: 'cluster-1'
        }
      },
      {
        name: 'KUBE_CLUSTER_2',
        loadFrom: LoadFrom.FILE,
        opts: {
          file: '/path/to/kubeconfig',
          context: 'cluster-2'
        }
      }
    ], 
    isGlobal: true
  })]
})
export class AppModule {
}
```


## Injecting KubeConfig in scoped providers

```typescript
// module.ts
import { Module } from "@nestjs/common";
import { KubernetesModule, LoadFrom } from '@otwld/nestjs-kubernetes';
import { Service } from "./service";

@Module({
  imports: [KubernetesModule.register([
    {
      name: 'KUBE_CLUSTER',
      loadFrom: LoadFrom.CLUSTER,
    }
  ])],
  providers: [
    Service,
  ],
})
export class AppModule {}
```

```typescript
// service.ts
import { Inject, Injectable } from "@nestjs/common";
import { KubeConfig, CoreV1Api } from "@kubernetes/client-node";

@Injectable()
export class Service {
  private coreV1Api: CoreV1Api;
  
  constructor(@Inject("KUBE_CLUSTER") public kubeConfig: KubeConfig) {
    this.coreV1Api = this.kubeConfig.makeApiClient(CoreV1Api);
  }
}
```

## Support

- For questions, suggestions, and discussion about NestJS please refer to
  the [NestJS issue page](https://github.com/nestjs/nest/issues)
- For questions, suggestions, and discussion about NestJS Kubernetes please
  visit [NestJS Kubernetes issue page](https://github.com/otwld/nestjs-kubernetes/issues) or join our [OTWLD Discord](https://discord.gg/U24mpqTynB)
