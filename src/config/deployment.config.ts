interface ModuleDefinition {
  path: string;
}
interface DeploymentTarget {
  port: number;
  modules: string[];
}

export const availableModules: Record<string, ModuleDefinition> = {
  // 'products': { path: '@/modules/products/products.routes' },
  users: { path: '@/modules/users/users.routes' },
};

export const deploymentTargets: Record<string, DeploymentTarget> = {
  users: { port: 2001, modules: ['users'] },
};

export const devModeModules: string[] = ['users'];
