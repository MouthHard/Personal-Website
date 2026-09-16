interface BackContent {
  era: string;
  contribution: string;
  influence: string;
  funFact: string;
  relatedFigures: string[];
}

export interface HistoricalFigure {
  id: string;
  name: string;
  dynasty: string;
  category: string;
  title: string;
  brief: string;
  description: string;
  achievements: string[];
  quotes: string;
  portraitUrl: string;
  tags: string[];
  backContent?: BackContent;
}

export interface CulturalHeritageItem {
  id: string;
  name: string;
  location: string;
  category: string;
  era: string;
  year: string;
  brief: string;
  description: string;
  history: string;
  culturalSignificance: string;
  features: string[];
  relatedFigures: string[];
  imageUrl: string;
  thumbnailUrl: string;
  images: string[];
  relatedItems: string[];
}
