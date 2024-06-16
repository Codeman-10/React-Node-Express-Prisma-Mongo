// sassTransform.js
import sass from 'sass'
const config = {
  process(src, filename, config, options) {
    const result = sass.renderSync({ file: filename });
    return {
      code: result.css.toString(),
      map: JSON.stringify(result.map),
    };
  },
};

export default config