package jaram.cmm.util;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * ckeditor 업로드
 */
@Configuration
public class WebResourceConfiguration implements WebMvcConfigurer {
    @Value("${jaram.ckeditor.image.upload.path}")
   String imagePath;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/ckeditor/upload/**")
                .addResourceLocations(imagePath);
    }

}