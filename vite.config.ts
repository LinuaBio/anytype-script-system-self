import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import replace from 'rollup-plugin-replace';
import builtins from 'rollup-plugin-node-builtins';

const isBuildCommand = process.argv.includes('build');
// https://vitejs.dev/config/
const getConfig = () => {
  if (isBuildCommand) {
    return defineConfig({
      css: {
        preprocessorOptions: {
          scss: {
            additionalData: `@import "./src/style/variables.scss";`
          }
        }
      },
      plugins: [
        vue(), 
        replace({
        'process.env.NODE_ENV': JSON.stringify('production')
        }),
        builtins(),
      ],
      build: {
        rollupOptions: {
          output: {
            dir: 'dist',
          },
        },
        minify: false, // 代码压缩
        lib: {
          entry: './src/main.ts',
          formats: ['umd'],
          name: 'antypeScript',
        },
      },
    });
  } else {
    return defineConfig({
      plugins: [vue()],
      build: {
        rollupOptions: {
          input: {
            main: './src/run/main.ts', // 设置你想要作为入口的 main.ts 文件路径
          },
        },
      },
    });
  }
};

export default getConfig();