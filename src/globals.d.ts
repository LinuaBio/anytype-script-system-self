import Path from 'path';

const globals = {
  componentRootPath: 'D:/Project/Anytype/vue-component/src/components',
  componentPath(path: string): string {
    return Path.join(this.componentRootPath, path);
  },
};

export { globals }