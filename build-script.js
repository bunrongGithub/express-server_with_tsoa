const esbuild = require("esbuild");
const path = require("path");
const fs = require("fs-extra");
const copy = require("esbuild-plugin-copy").default;
esbuild.build({
    entryPoints: ['src/server.ts'],
    bundle: true,
    platform: 'node',
    target: 'node20',
    outdir: 'build',
    external: ['express'],
    loader: {
        '.ts': 'ts',
    },
    plugins: [
        copy({
                assets: [
                    {
                        from: `./node_modules/swagger-ui-dist/*.css`,
                        to: './',
                    },
                    {
                        from: `./node_modules/swagger-ui-dist/*.js`,
                        to: './',
                    },
                    {
                        from: `./node_modules/swagger-ui-dist/*.png`,
                        to: './',
                    },
                    {
                        from: './src/configs/.env.production',
                        to: './configs',
                    },
                ],
        })
    ],
    resolveExtensions: ['.ts', '.js'],
    define: {
        'process.env.NODE_ENV': '"production"',
    },
    alias: {
        '@': path.resolve(__dirname, '.'),
    }
}).then(() => {
    fs.copySync(path.resolve(__dirname, 'src/docs/swagger.json'), path.resolve(__dirname, 'build/docs/swagger.json'));
    console.log('Swagger JSON copied successfully!');
    /** copy pagkage.json after unsuring the build was successful */
    fs.copySync(path.resolve(__dirname,'package.json'),path.resolve(__dirname,"build/package.json"));
    console.log("Package.jon copied successfully!")
    fs.copySync(path.resolve(__dirname, 'ecosystem.config.js'), path.resolve(__dirname, "build/ecosystem.config.js"));
    console.log("Ecosystem config copied successfully!")
})
    .catch(er => {
        console.error('Build failed: ', er);
        process.exit(1);
    })