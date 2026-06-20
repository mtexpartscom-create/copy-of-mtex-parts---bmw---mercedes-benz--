import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useLocation } from 'wouter';
import { trpc } from '@/lib/trpc';

export default function Checkout() {
  const { items, totalPrice, clearCart } = useCart();
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerCity: '',
    econtOffice: '',
    paymentMethod: 'cash_on_delivery',
  });

  const createOrderMutation = trpc.ecommerce.orders.create.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createOrderMutation.mutateAsync({
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        customerCity: formData.customerCity,
        econtOffice: formData.econtOffice,
        items: items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
        totalPrice: totalPrice.toString(),
        paymentMethod: formData.paymentMethod as 'cash_on_delivery' | 'bank_transfer',
      });

      // Clear cart and redirect to success page
      clearCart();
      setLocation('/order-success');
    } catch (error) {
      console.error('Order creation failed:', error);
      alert('Възникна грешка при създаване на поръчката. Моля, опитайте отново.');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#0a0a0a',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
      }}>
        <h1 style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: '2rem',
          color: '#f0f0ee',
          marginBottom: '1rem',
        }}>
          Вашата количка е празна
        </h1>
        <button
          onClick={() => setLocation('/catalog')}
          style={{
            padding: '0.75rem 1.5rem',
            background: '#FF0000',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Към каталога
        </button>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0a',
      padding: '2rem',
      paddingTop: '6rem',
    }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <h1 style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: '2.5rem',
          color: '#f0f0ee',
          marginBottom: '2rem',
        }}>
          Оформяне на поръчка
        </h1>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem' }}>
          {/* Checkout form */}
          <form onSubmit={handleSubmit}>
            <div style={{
              padding: '2rem',
              background: '#1a1a1a',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 12,
              marginBottom: '2rem',
            }}>
              <h2 style={{
                color: '#f0f0ee',
                marginBottom: '1.5rem',
                fontSize: '1.25rem',
                fontWeight: 700,
              }}>
                Лични данни
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <input
                  type="text"
                  placeholder="Име"
                  required
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  style={{
                    padding: '0.75rem',
                    background: '#0a0a0a',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 8,
                    color: '#f0f0ee',
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                  }}
                />
                <input
                  type="tel"
                  placeholder="Телефон"
                  required
                  value={formData.customerPhone}
                  onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                  style={{
                    padding: '0.75rem',
                    background: '#0a0a0a',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 8,
                    color: '#f0f0ee',
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                  }}
                />
                <input
                  type="text"
                  placeholder="Град"
                  required
                  value={formData.customerCity}
                  onChange={(e) => setFormData({ ...formData, customerCity: e.target.value })}
                  style={{
                    padding: '0.75rem',
                    background: '#0a0a0a',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 8,
                    color: '#f0f0ee',
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                  }}
                />
              </div>
            </div>

            <div style={{
              padding: '2rem',
              background: '#1a1a1a',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 12,
              marginBottom: '2rem',
            }}>
              <h2 style={{
                color: '#f0f0ee',
                marginBottom: '1.5rem',
                fontSize: '1.25rem',
                fontWeight: 700,
              }}>
                Доставка
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <input
                  type="text"
                  placeholder="Адрес на Eконт офис"
                  required
                  value={formData.econtOffice}
                  onChange={(e) => setFormData({ ...formData, econtOffice: e.target.value })}
                  style={{
                    padding: '0.75rem',
                    background: '#0a0a0a',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 8,
                    color: '#f0f0ee',
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                  }}
                />
              </div>
            </div>

            <div style={{
              padding: '2rem',
              background: '#1a1a1a',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 12,
              marginBottom: '2rem',
            }}>
              <h2 style={{
                color: '#f0f0ee',
                marginBottom: '1.5rem',
                fontSize: '1.25rem',
                fontWeight: 700,
              }}>
                Начин на плащане
              </h2>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                color: '#f0f0ee',
                cursor: 'pointer',
              }}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cash_on_delivery"
                  checked={formData.paymentMethod === 'cash_on_delivery'}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  style={{ cursor: 'pointer' }}
                />
                Наложен платеж (при доставка)
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '1rem',
                background: '#FF0000',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1,
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                if (!loading) (e.currentTarget as HTMLElement).style.background = '#FF3333';
              }}
              onMouseLeave={(e) => {
                if (!loading) (e.currentTarget as HTMLElement).style.background = '#FF0000';
              }}
            >
              {loading ? 'Обработка...' : 'Потвърди поръчката'}
            </button>
          </form>

          {/* Order summary */}
          <div style={{
            padding: '2rem',
            background: '#1a1a1a',
            border: '1px solid rgba(255,0,0,0.3)',
            borderRadius: 12,
            height: 'fit-content',
            position: 'sticky',
            top: '100px',
          }}>
            <h2 style={{
              color: '#f0f0ee',
              marginBottom: '1.5rem',
              fontSize: '1.25rem',
              fontWeight: 700,
            }}>
              Резюме на поръчка
            </h2>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              marginBottom: '1.5rem',
              paddingBottom: '1.5rem',
              borderBottom: '1px solid rgba(255,255,255,0.1)',
            }}>
              {items.map(item => (
                <div key={item.productId} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  color: '#9ca3af',
                  fontSize: '0.875rem',
                }}>
                  <span>{item.name} x{item.quantity}</span>
                  <span>{item.price}</span>
                </div>
              ))}
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '1rem',
              paddingBottom: '1rem',
              borderBottom: '1px solid rgba(255,255,255,0.1)',
            }}>
              <span style={{ color: '#9ca3af' }}>Обща цена:</span>
              <span style={{ color: '#FF0000', fontWeight: 700, fontSize: '1.25rem' }}>
                {totalPrice.toFixed(2)} лв
              </span>
            </div>
            <p style={{
              color: '#6b7280',
              fontSize: '0.875rem',
              textAlign: 'center',
            }}>
              Доставка: Eконт - Наложен платеж
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
