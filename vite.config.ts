import { defineConfig } from 'vite'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        dts({
            outDir: "./dist"
        })
    ],
    build: {
        lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            name: 'table-copy-vanilla',
            fileName: (format) => `table-copy-vanilla.${format}.js`,
        },
        rollupOptions: {

        },
    },
})