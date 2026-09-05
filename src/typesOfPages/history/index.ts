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
