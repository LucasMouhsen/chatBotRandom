const axios = require("axios").default;
const fs = require("fs");
const path = require("path");

const authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiYzQ3MGMzOGMtZDkxMi00NTdlLWI0ZGEtNjk5YjdhNGMzNzY3IiwidHlwZSI6ImFwaV90b2tlbiJ9.XJ3idjv5ZRswTMg_Qr6YyLW47_rAO6V1Xlv5VCcU274";

const generateImage = async (ctx) => {
    try {
      const options = {
        method: "POST",
        url: "https://api.edenai.run/v2/image/generation",
        headers: {
          authorization: `Bearer ${authToken}`,
        },
        data: {
          providers: "openai",
          text: ctx,
          resolution: "512x512",
        },
      };
      console.log(options);
  
      const response = await axios.request(options);
      const data = response.data.openai.items[0];
      const imageUrl = data.image_resource_url;
  
      const timestamp = new Date().getTime();
      const imageName = `generated_image_${timestamp}.png`;
      const imagesDir = path.join(__dirname, "images");
      const imagePath = path.join(imagesDir, imageName);
  
      if (!fs.existsSync(imagesDir)) {
        fs.mkdirSync(imagesDir);
      }
  
      const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
      fs.writeFileSync(imagePath, imageResponse.data);
  
      return { imagePath };
    } catch (error) {
      console.error("Error en la solicitud:", error.message);
      throw error;
    }
  };

module.exports = { generateImage };
