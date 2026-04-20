module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "src/images": "images" });

  eleventyConfig.addFilter("brl", (value) => {
    const n = Number(value);
    return "R$ " + n.toFixed(2).replace(".", ",").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  });

  eleventyConfig.addFilter("brlParts", (value) => {
    const [int, dec] = Number(value).toFixed(2).split(".");
    return {
      int: Number(int).toLocaleString("pt-BR"),
      dec,
    };
  });

  eleventyConfig.addFilter("ptNumber", (value) => {
    return Number(value).toLocaleString("pt-BR");
  });

  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site",
    },
    templateFormats: ["njk", "md", "html"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
};
