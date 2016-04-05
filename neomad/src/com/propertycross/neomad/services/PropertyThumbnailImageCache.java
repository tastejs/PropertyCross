package com.propertycross.neomad.services;

import com.neomades.content.image.FileImageCache;
import com.neomades.content.image.ImageCache;
import com.neomades.content.image.MemoryImageCache;
import com.neomades.graphics.Image;
import com.neomades.io.file.File;
import com.propertycross.neomad.Constants;
import com.propertycross.neomad.PropertyCross;

public class PropertyThumbnailImageCache implements ImageCache {

	private MemoryImageCache memoryImageCache;
	private FileImageCache fileImageCache;
	
	public PropertyThumbnailImageCache() {
		memoryImageCache = new MemoryImageCache(Constants.MEMORY_THUMBNAILS_CACHE_LRU_COUNT);
		fileImageCache = new FileImageCache(new File(PropertyCross.getAppCacheDir(), Constants.PROPERTIES_THUMBNAILS_CACHE));
	}

	public void clear() {
		memoryImageCache.clear();
		fileImageCache.clear();
	}

	public Image getImage(String url) {
		Image image = memoryImageCache.getImage(url);
		if (image == null) {
			image = fileImageCache.getImage(url);
		}
		return image;
	}

	public void putImage(String arg0, Image arg1) {
		fileImageCache.putImage(arg0, arg1);
		memoryImageCache.putImage(arg0, arg1);
	}	
}
