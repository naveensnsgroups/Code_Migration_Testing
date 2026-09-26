# Migration Rules: JavaScript to TypeScript Backend

1. **Imports/Exports**: Replace CommonJS `require()` and `module.exports` with ES Modules `import` and `export`.
2. **Type Safety**: Add TypeScript types/interfaces for Express request/response objects, middleware, and Mongoose models.
3. **Configuration**: Add `tsconfig.json` optimized for Node.js and Express.
4. **Build & Scripts**: Update `package.json` scripts to compile TypeScript via `tsc` or run with `ts-node` / `tsx`.
