import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Shuffle, Sparkles } from 'lucide-react';

const affirmationCategories = {
  success: {
    label: 'Success',
    icon: '🏆',
    affirmations: [
      "I am destined for greatness",
      "Success flows to me naturally",
      "I achieve everything I set my mind to",
      "I am a powerful creator of my reality",
      "My potential is unlimited",
      "I am worthy of massive success",
      "Every day I move closer to my goals",
      "I am a magnet for opportunities",
      "I turn obstacles into stepping stones",
      "Victory is my birthright",
      "I accomplish my goals with ease",
      "Success is my natural state",
      "I am built for achievement",
      "My dreams are within reach",
      "I celebrate my wins, big and small",
      "I am focused and determined",
      "Excellence flows through everything I do",
      "I attract successful people into my life",
      "My hard work always pays off",
      "I am unstoppable"
    ]
  },
  wealth: {
    label: 'Wealth',
    icon: '💰',
    affirmations: [
      "Money flows to me easily and freely",
      "I am a money magnet",
      "Wealth is my birthright",
      "I attract abundance in all forms",
      "My bank account grows every day",
      "I am financially free",
      "Money comes to me from multiple sources",
      "I deserve to be wealthy",
      "I manage my money wisely",
      "Prosperity follows me everywhere",
      "I am open to receiving unlimited abundance",
      "My income exceeds my expenses",
      "I create wealth effortlessly",
      "Financial freedom is mine",
      "I am grateful for my abundance",
      "I release all resistance to wealth",
      "Money is a positive force in my life",
      "I am worthy of financial success",
      "Wealth allows me to help others",
      "I live an abundant life"
    ]
  },
  health: {
    label: 'Health',
    icon: '💪',
    affirmations: [
      "My body is healthy and strong",
      "I radiate health and vitality",
      "Every cell in my body is healthy",
      "I nourish my body with healthy choices",
      "I am grateful for my health",
      "My immune system is powerful",
      "I love and care for my body",
      "Health flows through me",
      "I make healthy choices easily",
      "My body heals quickly and naturally",
      "I am full of energy",
      "I honor my body's needs",
      "Wellness is my natural state",
      "I breathe in health, I exhale stress",
      "My mind and body are in harmony",
      "I am getting healthier every day",
      "I deserve to feel amazing",
      "My body is my temple",
      "I treat my body with love and respect",
      "Perfect health is mine"
    ]
  },
  love: {
    label: 'Love',
    icon: '❤️',
    affirmations: [
      "I am worthy of deep love",
      "Love flows to me effortlessly",
      "I attract my perfect partner",
      "I am surrounded by loving relationships",
      "I give and receive love freely",
      "My heart is open to love",
      "I deserve a loving relationship",
      "Love finds me wherever I go",
      "I am a loving and lovable person",
      "My relationships are harmonious",
      "I attract genuine connections",
      "I am complete within myself",
      "Love starts with self-love",
      "I radiate love and warmth",
      "My partner and I support each other",
      "I attract soulmate energy",
      "I am magnetic to love",
      "I create loving bonds easily",
      "My love life is beautiful",
      "I am grateful for love in my life"
    ]
  },
  confidence: {
    label: 'Confidence',
    icon: '⭐',
    affirmations: [
      "I believe in myself completely",
      "I am confident in all I do",
      "My self-worth is unshakeable",
      "I trust my abilities",
      "I am proud of who I am",
      "I radiate confidence",
      "I am enough, just as I am",
      "I embrace my uniqueness",
      "I speak with confidence",
      "I am bold and courageous",
      "I face challenges with strength",
      "My confidence grows daily",
      "I am comfortable being myself",
      "I deserve to take up space",
      "I trust my inner wisdom",
      "I am fearless in pursuing my dreams",
      "My voice matters",
      "I am worthy of respect",
      "I stand tall and proud",
      "I own my power"
    ]
  },
  career: {
    label: 'Career',
    icon: '💼',
    affirmations: [
      "I am excellent at what I do",
      "My career is thriving",
      "I attract amazing opportunities",
      "I am a valuable asset",
      "My work makes a difference",
      "I am promoted and recognized",
      "Success comes naturally in my career",
      "I love my work",
      "I am respected by my colleagues",
      "My skills are in high demand",
      "I create my dream career",
      "I am a leader in my field",
      "My work is meaningful",
      "I achieve work-life balance",
      "I am compensated fairly",
      "I grow professionally every day",
      "I am open to new opportunities",
      "My career brings me joy",
      "I make smart career decisions",
      "I am building my legacy"
    ]
  },
  gratitude: {
    label: 'Gratitude',
    icon: '🙏',
    affirmations: [
      "I am grateful for this moment",
      "Thank you for all my blessings",
      "I appreciate everything I have",
      "Gratitude fills my heart",
      "I see beauty everywhere",
      "I am thankful for my journey",
      "Every day is a gift",
      "I appreciate my life deeply",
      "Gratitude attracts more blessings",
      "I am thankful for my growth",
      "I honor all experiences",
      "I am grateful for my health",
      "Thank you for my abundance",
      "I appreciate the little things",
      "Gratitude is my superpower",
      "I am blessed beyond measure",
      "I give thanks for my relationships",
      "I am grateful for another day",
      "Thank you for my strength",
      "I appreciate who I am becoming"
    ]
  },
  growth: {
    label: 'Growth',
    icon: '🌱',
    affirmations: [
      "I am constantly evolving",
      "Every day I become better",
      "I embrace personal growth",
      "I learn from every experience",
      "Change is beautiful",
      "I am open to transformation",
      "My potential is infinite",
      "I grow through challenges",
      "I invest in myself daily",
      "I am a lifelong learner",
      "I welcome new perspectives",
      "Growth is my priority",
      "I shed old patterns easily",
      "I become more of who I am",
      "I am evolving into my best self",
      "Every setback is a setup",
      "I trust my growth process",
      "I am patient with myself",
      "I celebrate my progress",
      "I am exactly where I need to be"
    ]
  },
  peace: {
    label: 'Peace',
    icon: '🕊️',
    affirmations: [
      "I am calm and centered",
      "Peace flows through me",
      "I release all worry",
      "I am at peace with myself",
      "Serenity is my nature",
      "I let go of stress easily",
      "I breathe in peace",
      "My mind is quiet and still",
      "I am grounded and stable",
      "Peace surrounds me always",
      "I choose peace over worry",
      "I am in harmony with life",
      "Calmness is my superpower",
      "I release what I cannot control",
      "I am present in this moment",
      "Inner peace is my priority",
      "I am relaxed and at ease",
      "I find peace in simplicity",
      "I am free from anxiety",
      "Tranquility fills my soul"
    ]
  },
  creativity: {
    label: 'Creativity',
    icon: '🎨',
    affirmations: [
      "I am endlessly creative",
      "Ideas flow to me naturally",
      "I express myself authentically",
      "My creativity knows no bounds",
      "I am an innovative thinker",
      "Inspiration strikes me daily",
      "I create with joy and ease",
      "My imagination is powerful",
      "I trust my creative instincts",
      "I bring ideas to life",
      "Creativity is my birthright",
      "I think outside the box",
      "I am a creative genius",
      "My unique vision matters",
      "I embrace creative risks",
      "Art flows through me",
      "I find inspiration everywhere",
      "My creativity heals and inspires",
      "I am a visionary",
      "I create my own reality"
    ]
  }
};

export default function AffirmationLibrary({ onSelectAffirmation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('success');

  const allAffirmations = Object.values(affirmationCategories).flatMap(cat => 
    cat.affirmations.map(a => ({ text: a, category: cat.label, icon: cat.icon }))
  );

  const filteredAffirmations = searchQuery
    ? allAffirmations.filter(a => a.text.toLowerCase().includes(searchQuery.toLowerCase()))
    : affirmationCategories[activeCategory]?.affirmations || [];

  const getRandomAffirmation = () => {
    const all = allAffirmations;
    const random = all[Math.floor(Math.random() * all.length)];
    onSelectAffirmation(random.text);
  };

  const handleSelect = (text) => {
    onSelectAffirmation(text);
  };

  const categoryKeys = Object.keys(affirmationCategories);

  return (
    <div className="space-y-4">
      {/* Random Button */}
      <Button 
        onClick={getRandomAffirmation}
        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
      >
        <Shuffle className="w-4 h-4 mr-2" />
        Random Affirmation
      </Button>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search 200+ affirmations..."
          className="pl-9 dark:bg-gray-700"
        />
      </div>

      {/* Categories */}
      {!searchQuery && (
        <div className="flex flex-wrap gap-1">
          {categoryKeys.map(key => (
            <button
              key={key}
              onClick={() => setActiveCategory(key)}
              className={`text-xs px-2 py-1 rounded-full transition ${
                activeCategory === key 
                  ? 'bg-purple-500 text-white' 
                  : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {affirmationCategories[key].icon} {affirmationCategories[key].label}
            </button>
          ))}
        </div>
      )}

      {/* Affirmations List */}
      <ScrollArea className="h-[350px]">
        <div className="space-y-2">
          {(searchQuery ? filteredAffirmations.map(a => a.text) : filteredAffirmations).map((aff, i) => (
            <button
              key={i}
              onClick={() => handleSelect(typeof aff === 'string' ? aff : aff.text)}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData('affirmation-text', typeof aff === 'string' ? aff : aff.text);
                e.dataTransfer.setData('item-type', 'affirmation');
              }}
              className="w-full text-left p-3 text-sm bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg hover:from-purple-100 hover:to-pink-100 dark:hover:from-purple-900/40 dark:hover:to-pink-900/40 transition border border-purple-100 dark:border-purple-800"
            >
              <Sparkles className="w-3 h-3 inline mr-2 text-purple-500" />
              "{typeof aff === 'string' ? aff : aff.text}"
            </button>
          ))}
        </div>
      </ScrollArea>

      <p className="text-xs text-center text-gray-400">
        Drag affirmations to your board or click to add
      </p>
    </div>
  );
}