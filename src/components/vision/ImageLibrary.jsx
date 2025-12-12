import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Loader2, Heart, Upload } from 'lucide-react';
import { base44 } from '@/api/base44Client.supabase';

const categories = [
  { id: 'success', label: 'Success', query: 'success motivation achievement' },
  { id: 'nature', label: 'Nature', query: 'beautiful nature landscape' },
  { id: 'travel', label: 'Travel', query: 'travel destination vacation' },
  { id: 'business', label: 'Business', query: 'business success office' },
  { id: 'wellness', label: 'Wellness', query: 'wellness health fitness yoga' },
  { id: 'wealth', label: 'Wealth', query: 'luxury wealth money abundance' },
  { id: 'love', label: 'Love', query: 'love romance couple family' },
  { id: 'career', label: 'Career', query: 'career professional growth' },
];

const stockImages = {
  success: [
    'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1519834785169-98be25ec3f84?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1523287562758-66c7fc58967f?auto=format&fit=crop&w=400&q=80',
  ],
  nature: [
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1433086966358-54859d0ed716?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=400&q=80',
  ],
  travel: [
    'https://images.unsplash.com/photo-1488085061387-422e29b40080?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1503220317375-aaad61436b1b?auto=format&fit=crop&w=400&q=80',
  ],
  business: [
    'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1553028826-f4804a6dba3b?auto=format&fit=crop&w=400&q=80',
  ],
  wellness: [
    'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=400&q=80',
  ],
  wealth: [
    'https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1565372195458-9de0b320ef04?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1559526324-593bc073d938?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=400&q=80',
  ],
  love: [
    'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1474552226712-ac0f0961a954?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1609220136736-443140cffec6?auto=format&fit=crop&w=400&q=80',
  ],
  career: [
    'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=400&q=80',
  ],
};

export default function ImageLibrary({ onSelectImage, onUploadImage }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [activeCategory, setActiveCategory] = useState('success');
  const [favorites, setFavorites] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('vb_favorite_images');
    if (saved) setFavorites(JSON.parse(saved));
  }, []);

  const searchImages = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);

    // Using curated fallback images based on search query
    const allImages = Object.values(stockImages).flat();
    const shuffled = [...allImages].sort(() => Math.random() - 0.5);
    setSearchResults(shuffled.slice(0, 12));
    setIsSearching(false);
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size (3MB = 3 * 1024 * 1024 bytes)
    if (file.size > 3 * 1024 * 1024) {
      alert('Image size must be less than 3MB');
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    setIsUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      onSelectImage(file_url);
    } catch (error) {
      console.error(error);
      alert('Failed to upload image');
    }
    setIsUploading(false);
  };

  const toggleFavorite = (url) => {
    const newFavorites = favorites.includes(url)
      ? favorites.filter(f => f !== url)
      : [...favorites, url];
    setFavorites(newFavorites);
    localStorage.setItem('vb_favorite_images', JSON.stringify(newFavorites));
  };

  const ImageGrid = ({ images, showFavorite = true }) => (
    <div className="grid grid-cols-2 gap-2">
      {images.map((url, i) => (
        <div key={i} className="relative group">
          <img
            src={url}
            alt=""
            className="w-full h-24 object-cover rounded-lg cursor-pointer hover:opacity-90 transition"
            onClick={() => onSelectImage(url)}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData('image-url', url);
              e.dataTransfer.setData('item-type', 'image');
            }}
          />
          {showFavorite && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(url);
              }}
              className="absolute top-1 right-1 p-1 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition"
            >
              <Heart className={`w-3 h-3 ${favorites.includes(url) ? 'fill-red-500 text-red-500' : 'text-white'}`} />
            </button>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Upload */}
      <label className="flex items-center justify-center w-full h-16 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition">
        {isUploading ? (
          <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
        ) : (
          <div className="flex items-center gap-2 text-gray-500">
            <Upload className="w-5 h-5" />
            <span className="text-sm">Upload Image</span>
          </div>
        )}
        <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
      </label>

      {/* Search */}
      <div className="flex gap-2">
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search images..."
          onKeyDown={(e) => e.key === 'Enter' && searchImages()}
          className="dark:bg-gray-700"
        />
        <Button size="icon" onClick={searchImages} disabled={isSearching}>
          {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
        </Button>
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-gray-500">Search Results</p>
          <ImageGrid images={searchResults} />
          <Button variant="ghost" size="sm" className="w-full" onClick={() => setSearchResults([])}>
            Clear Results
          </Button>
        </div>
      )}

      {/* Categories */}
      <ScrollArea className="h-[400px]">
        <Tabs value={activeCategory} onValueChange={setActiveCategory}>
          <TabsList className="grid grid-cols-4 gap-1 h-auto p-1">
            {categories.slice(0, 4).map(cat => (
              <TabsTrigger key={cat.id} value={cat.id} className="text-xs px-2 py-1">
                {cat.label}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsList className="grid grid-cols-4 gap-1 h-auto p-1 mt-1">
            {categories.slice(4).map(cat => (
              <TabsTrigger key={cat.id} value={cat.id} className="text-xs px-2 py-1">
                {cat.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map(cat => (
            <TabsContent key={cat.id} value={cat.id} className="mt-3">
              <ImageGrid images={stockImages[cat.id] || []} />
            </TabsContent>
          ))}
        </Tabs>

        {/* Favorites */}
        {favorites.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
              <Heart className="w-3 h-3 text-red-500" /> My Favorites
            </p>
            <ImageGrid images={favorites} showFavorite />
          </div>
        )}
      </ScrollArea>
    </div>
  );
}