import { useState } from 'react';
import { Info, X, Upload, BookOpen, Heart, ChevronDown, ChevronUp, LogIn, LogOut, ShieldCheck, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/i18n/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';

interface SettingsPanelProps {
  onUploadFile: (file: File) => void;
}

export default function SettingsPanel({ onUploadFile }: SettingsPanelProps) {
  const { lang, t } = useLanguage();
  const { isAdmin } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'guide' | 'upload' | 'about' | 'login'>('guide');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const AboutTab = () => (
    <div className="space-y-4 text-sm">
      <div>
        <h3 className="font-semibold text-lg mb-2">
          {t('about.title')}
        </h3>
        <p className="text-gray-600 dark:text-gray-300">
          {t('about.description')}
        </p>
      </div>
      
      <div className="border-t pt-4">
        <h4 className="font-semibold mb-2">{t('about.legal.title')}</h4>
        <div className="space-y-3 text-xs text-gray-600 dark:text-gray-400">
          <div>
            <p className="font-semibold text-gray-700 dark:text-gray-300">{t('about.legal.disclaimer.title')}</p>
            <p>{t('about.legal.disclaimer.content')}</p>
          </div>
          
          <div>
            <p className="font-semibold text-gray-700 dark:text-gray-300">{t('about.legal.dataAccuracy.title')}</p>
            <p>{t('about.legal.dataAccuracy.content')}</p>
          </div>
          
          <div>
            <p className="font-semibold text-gray-700 dark:text-gray-300">{t('about.legal.noLiability.title')}</p>
            <p>{t('about.legal.noLiability.content')}</p>
          </div>
          
          <div>
            <p className="font-semibold text-gray-700 dark:text-gray-300">{t('about.legal.privacy.title')}</p>
            <p>{t('about.legal.privacy.content')}</p>
          </div>
          
          <div>
            <p className="font-semibold text-gray-700 dark:text-gray-300">{t('about.legal.intellectual.title')}</p>
            <p>{t('about.legal.intellectual.content')}</p>
          </div>
          
          <div>
            <p className="font-semibold text-gray-700 dark:text-gray-300">{t('about.legal.changes.title')}</p>
            <p>{t('about.legal.changes.content')}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center pt-4 border-t">
        <Heart className="w-4 h-4 mr-2 text-red-500" />
        <span className="text-xs text-gray-500">
          {t('about.madeWith')}
        </span>
      </div>
    </div>
  );

  const GuideTab = () => {
    const sections = [
      {
        id: 'overview',
        title: t('guide.overview.title'),
        content: t('guide.overview.content')
      },
      {
        id: 'search',
        title: t('guide.search.title'),
        content: t('guide.search.content'),
        features: [
          t('guide.search.features.semantic'),
          t('guide.search.features.multilingual'),
          t('guide.search.features.fuzzy'),
          t('guide.search.features.filters')
        ]
      },
      {
        id: 'map',
        title: t('guide.map.title'),
        content: t('guide.map.content'),
        features: [
          t('guide.map.features.interactive'),
          t('guide.map.features.visual'),
          t('guide.map.features.details'),
          t('guide.map.features.zoom')
        ]
      },
      {
        id: 'filters',
        title: t('guide.filters.title'),
        content: t('guide.filters.content'),
        features: [
          t('guide.filters.features.country'),
          t('guide.filters.features.river'),
          t('guide.filters.features.type'),
          t('guide.filters.features.year')
        ]
      },
      {
        id: 'details',
        title: t('guide.details.title'),
        content: t('guide.details.content')
      },
      {
        id: 'tips',
        title: t('guide.tips.title'),
        items: [
          t('guide.tips.items.combine'),
          t('guide.tips.items.language'),
          t('guide.tips.items.hover'),
          t('guide.tips.items.reset')
        ]
      }
    ];

    return (
      <div className="space-y-2">
        {sections.map(section => (
          <div key={section.id} className="border rounded-lg">
            <button
              onClick={() => toggleSection(section.id)}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <span className="font-semibold text-left">{section.title}</span>
              {expandedSections[section.id] ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
            
            {expandedSections[section.id] && (
              <div className="px-4 pb-4 space-y-2">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {section.content}
                </p>
                {'features' in section && section.features && (
                  <ul className="list-disc list-inside text-sm space-y-1 text-gray-600 dark:text-gray-400">
                    {section.features.map((feature, idx) => (
                      <li key={idx}>{feature}</li>
                    ))}
                  </ul>
                )}
                {'items' in section && section.items && (
                  <ul className="list-disc list-inside text-sm space-y-1 text-gray-600 dark:text-gray-400">
                    {section.items.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const UploadTab = () => (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold mb-2">{t('upload.title')}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          {t('upload.description')}
        </p>
      </div>
      
      <div className="border-2 border-dashed rounded-lg p-6 text-center">
        <Input
          type="file"
          accept=".geojson,.json"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onUploadFile(file);
          }}
          className="max-w-full"
        />
        <p className="text-xs text-gray-500 mt-2">
          {t('upload.formats')}
        </p>
      </div>
      
      <div className="text-xs text-gray-500 space-y-1">
        <p className="font-semibold">{t('upload.requirements.title')}</p>
        <ul className="list-disc list-inside space-y-1">
          <li>{t('upload.requirements.geometry')}</li>
          <li>{t('upload.requirements.properties')}</li>
          <li>{t('upload.requirements.encoding')}</li>
        </ul>
      </div>
    </div>
  );

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="fixed top-4 left-4 z-50 bg-white dark:bg-gray-800 shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Info className="h-4 w-4" />
      </Button>

      {isOpen && (
        <div className="fixed left-4 top-16 z-50 w-96 max-h-[calc(100vh-5rem)] bg-white dark:bg-gray-900 rounded-lg shadow-xl border dark:border-gray-700 flex flex-col">
          <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
            <h2 className="text-lg font-semibold">{t('settings.title')}</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex border-b dark:border-gray-700">
            <button
              onClick={() => setActiveTab('guide')}
              className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === 'guide'
                  ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              <BookOpen className="w-4 h-4 inline mr-2" />
              {t('tabs.guide')}
            </button>
            <button
              onClick={() => setActiveTab('upload')}
              className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === 'upload'
                  ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              <Upload className="w-4 h-4 inline mr-2" />
              {t('tabs.upload')}
            </button>
            <button
              onClick={() => setActiveTab('about')}
              className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === 'about'
                  ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              <ShieldCheck className="w-4 h-4 inline mr-2" />
              {t('tabs.about')}
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {activeTab === 'guide' && <GuideTab />}
            {activeTab === 'upload' && <UploadTab />}
            {activeTab === 'about' && <AboutTab />}
          </div>
        </div>
      )}
    </>
  );
}
