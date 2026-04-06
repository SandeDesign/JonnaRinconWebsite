/**
 * Verwijdert alle undefined-waarden recursief uit een object
 * zodat Firestore addDoc/updateDoc niet crasht.
 */
export function cleanFirestoreData<T extends Record<string, any>>(data: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(data)
      .filter(([, value]) => value !== undefined)
      .map(([key, value]) => {
        if (value !== null && typeof value === 'object' && !Array.isArray(value) && !(value?.toDate)) {
          return [key, cleanFirestoreData(value)];
        }
        return [key, value];
      })
  ) as Partial<T>;
}
