export type SuggestionType =
   | "tag"
   | "share"
   | "action"
   | "insight"
   | "organization"
   | "security";
export type InsightSeverity = "info" | "warning" | "critical";

export interface AISuggestion {
   id: string;
   type: SuggestionType;
   title: string;
   description?: string;
   confidence: number;
   action?: () => void;
   actionLabel?: string;
   data?: any;
}

export interface AIInsight {
   id: string;
   severity: InsightSeverity;
   title: string;
   description: string;
   timestamp: Date;
   actions?: AIInsightAction[];
   relatedDocuments?: string[];
   relatedUsers?: string[];
}

export interface AIInsightAction {
   id: string;
   label: string;
   action: () => void;
   isPrimary?: boolean;
}

export interface AIDocumentSummary {
   documentId: string;
   summary: string;
   keyPoints: string[];
   documentType: string;
   language: string;
   wordCount: number;
   generatedAt: Date;
}

export interface AITagSuggestion {
   tag: string;
   confidence: number;
   category?: string;
}

export interface AIShareSuggestion {
   userId: string;
   userName: string;
   userEmail: string;
   reason: string;
   confidence: number;
}

export interface AISearchSuggestion {
   query: string;
   type: "recent" | "popular" | "recommended";
   relevance: number;
}

export interface AIAnomaly {
   id: string;
   type: "upload" | "access" | "permission" | "security";
   severity: InsightSeverity;
   userId: string;
   userName: string;
   description: string;
   details: string;
   timestamp: Date;
   isResolved: boolean;
}
