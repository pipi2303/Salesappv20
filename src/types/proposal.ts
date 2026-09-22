// Line item added to a proposal from the product catalog, carried through
// ProductCatalog.tsx -> ProposalBuilder.tsx as `items`/`onUpdateQuantity`/
// `onRemoveItem` props. Previously both files independently declared this
// same shape (ProductCatalog.tsx's copy additionally had an unused-by-
// ProposalBuilder `proposalType` field) with no shared import, so the
// producer and consumer of this prop could silently drift out of sync.
export interface ProposalItem {
  id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  description: string;
  features: string[];
  /** Marks technical (teknis) proposal items; ProposalBuilder ignores this. */
  proposalType?: 'teknis';
}
