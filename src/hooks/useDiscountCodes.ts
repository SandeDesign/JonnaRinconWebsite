import { useState, useEffect, useCallback } from 'react';
import { DiscountCode } from '../lib/firebase/types';
import { discountCodeService } from '../lib/firebase/services/discountCodeService';

export const useDiscountCodes = () => {
  const [discountCodes, setDiscountCodes] = useState<DiscountCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = discountCodeService.subscribeToDiscountCodes(
      (codes) => {
        setDiscountCodes(codes);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { discountCodes, loading, error, setError };
};

export const useDiscountCode = (id: string) => {
  const [discountCode, setDiscountCode] = useState<DiscountCode | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchCode = async () => {
      try {
        const codeData = await discountCodeService.getDiscountCodeById(id);
        setDiscountCode(codeData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCode();
  }, [id]);

  return { discountCode, loading, error, setError };
};

export const useValidateDiscount = () => {
  const [discount, setDiscount] = useState<DiscountCode | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateCode = useCallback(
    async (
      code: string,
      orderTotal: number,
      productIds: string[],
      productTypes: string[]
    ) => {
      setLoading(true);
      setError(null);
      setDiscount(null);

      try {
        const result = await discountCodeService.validateDiscountCode(
          code,
          orderTotal,
          productIds,
          productTypes
        );

        if (result.valid && result.discount) {
          setDiscount(result.discount);
        } else {
          setError(result.error || 'Invalid discount code');
        }

        return result;
      } catch (err: any) {
        setError(err.message || 'Failed to validate discount code');
        return { valid: false, discount: null, error: err.message };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { validateCode, discount, error, loading, setError, setDiscount };
};
