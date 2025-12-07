import React from 'react';
import {
  Briefcase, DollarSign, Heart, Activity, Plane, User, FileText
} from 'lucide-react';

const templates = [
  {
    id: 'blank',
    name: 'Blank Canvas',
    description: 'Start from scratch',
    icon: FileText,
    color: 'from-gray-400 to-gray-600',
    category: 'Other',
    background: '#f8fafc',
    items: []
  },
  {
    id: 'career',
    name: 'Career Growth',
    description: 'Professional success',
    icon: Briefcase,
    color: 'from-blue-400 to-blue-600',
    category: 'Career Growth',
    background: '#dbeafe',
    items: [
      { type: 'image', content: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=400&q=80', x: 50, y: 50, width: 280, height: 200 },
      { type: 'image', content: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=400&q=80', x: 360, y: 50, width: 250, height: 180 },
      { type: 'affirmation', content: 'I am successful in my career', x: 50, y: 280, width: 300, height: 80, style: { fontSize: '18px', color: '#1e40af' } },
      { type: 'text', content: 'MY CAREER GOALS', x: 640, y: 50, width: 280, height: 60, style: { fontSize: '24px', fontWeight: 'bold', color: '#1e40af' } },
    ]
  },
  {
    id: 'financial',
    name: 'Financial Goals',
    description: 'Wealth & abundance',
    icon: DollarSign,
    color: 'from-green-400 to-green-600',
    category: 'Financial Goals',
    background: '#d1fae5',
    items: [
      { type: 'image', content: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&w=400&q=80', x: 50, y: 50, width: 300, height: 220 },
      { type: 'affirmation', content: 'Money flows to me easily', x: 50, y: 300, width: 320, height: 80, style: { fontSize: '18px', color: '#166534' } },
      { type: 'text', content: 'FINANCIAL FREEDOM', x: 660, y: 50, width: 280, height: 60, style: { fontSize: '28px', fontWeight: 'bold', color: '#166534' } },
    ]
  },
  {
    id: 'health',
    name: 'Health & Wellness',
    description: 'Fitness & wellbeing',
    icon: Activity,
    color: 'from-red-400 to-red-600',
    category: 'Health & Wellness',
    background: '#fce7f3',
    items: [
      { type: 'image', content: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=400&q=80', x: 50, y: 50, width: 280, height: 200 },
      { type: 'affirmation', content: 'I am healthy and strong', x: 50, y: 280, width: 300, height: 80, style: { fontSize: '18px', color: '#be185d' } },
      { type: 'text', content: 'HEALTHY LIVING', x: 640, y: 50, width: 280, height: 60, style: { fontSize: '28px', fontWeight: 'bold', color: '#be185d' } },
    ]
  },
  {
    id: 'travel',
    name: 'Travel Dreams',
    description: 'Adventures & destinations',
    icon: Plane,
    color: 'from-cyan-400 to-cyan-600',
    category: 'Travel Dreams',
    background: '#cffafe',
    items: [
      { type: 'image', content: 'https://images.unsplash.com/photo-1488085061387-422e29b40080?auto=format&fit=crop&w=400&q=80', x: 50, y: 50, width: 300, height: 220 },
      { type: 'affirmation', content: 'I explore the world with joy', x: 50, y: 300, width: 320, height: 80, style: { fontSize: '18px', color: '#0891b2' } },
      { type: 'text', content: 'WANDERLUST', x: 660, y: 50, width: 280, height: 60, style: { fontSize: '32px', fontWeight: 'bold', color: '#0891b2' } },
    ]
  },
  {
    id: 'love',
    name: 'Relationships',
    description: 'Love & connections',
    icon: Heart,
    color: 'from-pink-400 to-pink-600',
    category: 'Relationships',
    background: '#fce7f3',
    items: [
      { type: 'image', content: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=400&q=80', x: 50, y: 50, width: 280, height: 200 },
      { type: 'affirmation', content: 'I am surrounded by love', x: 50, y: 280, width: 300, height: 80, style: { fontSize: '18px', color: '#db2777' } },
      { type: 'text', content: 'LOVE & CONNECTION', x: 640, y: 50, width: 300, height: 60, style: { fontSize: '26px', fontWeight: 'bold', color: '#db2777' } },
    ]
  },
  {
    id: 'growth',
    name: 'Personal Growth',
    description: 'Self-improvement',
    icon: User,
    color: 'from-purple-400 to-purple-600',
    category: 'Personal Development',
    background: '#f3e8ff',
    items: [
      { type: 'image', content: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=400&q=80', x: 50, y: 50, width: 280, height: 200 },
      { type: 'affirmation', content: 'I am my best self', x: 50, y: 280, width: 330, height: 80, style: { fontSize: '18px', color: '#7c3aed' } },
      { type: 'text', content: 'BECOME LIMITLESS', x: 640, y: 50, width: 300, height: 60, style: { fontSize: '28px', fontWeight: 'bold', color: '#7c3aed' } },
    ]
  }
];

export default function BoardTemplates({ onSelect }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4">
      {templates.map(template => {
        const Icon = template.icon;
        return (
          <button
            key={template.id}
            onClick={() => onSelect(template)}
            className="group relative overflow-hidden rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-purple-500 transition-all p-6 text-left hover:shadow-lg"
          >
            <div className={`w-12 h-12 bg-gradient-to-br ${template.color} rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{template.name}</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">{template.description}</p>
          </button>
        );
      })}
    </div>
  );
}

export { templates };