// Shared shape returned by every localStorage-backed repository in
// src/services/ (productsRepository, salesRepsRepository, commissionsRepository,
// territoriesRepository, performanceTargetsRepository). Previously each
// repository file declared this identical one-line type independently.
export type Result<T> = { success: boolean; data?: T; error?: string };
