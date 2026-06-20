import { useCart } from '@/contexts/CartContext';
import { Trash2, Plus, Minus, ShoppingCart as CartIcon } from 'lucide-react';
import { useLocation } from 'wouter';

export default function ShoppingCart() {
  const { items, removeItem, updateQuantity, clearCart, totalPrice } = useCart();
  const [, setLocation] = useLocation();

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
        <CartIcon size={64} style={{ color: '#FF0000', marginBottom: '1rem' }} />
        <h1 style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: '2rem',
          color: '#f0f0ee',
          marginBottom: '1rem',
        }}>
          Вашата количка е празна
        </h1>
        <p style={{
          color: '#9ca3af',
          marginBottom: '2rem',
          textAlign: 'center',
        }}>
          Добавете артикули от каталога, за да продължите със пазаруването
        </p>
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
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = '#FF3333';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = '#FF0000';
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
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <h1 style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: '2.5rem',
          color: '#f0f0ee',
          marginBottom: '2rem',
        }}>
          Пазарска кошница
        </h1>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem' }}>
          {/* Items list */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}>
            {items.map(item => (
              <div
                key={item.productId}
                style={{
                  display: 'flex',
                  gap: '1rem',
                  padding: '1.5rem',
                  background: '#1a1a1a',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 12,
                }}
              >
                {item.imageUrl && (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    style={{
                      width: 120,
                      height: 120,
                      objectFit: 'cover',
                      borderRadius: 8,
                    }}
                  />
                )}
                <div style={{ flex: 1 }}>
                  <h3 style={{
                    color: '#f0f0ee',
                    marginBottom: '0.5rem',
                    fontWeight: 600,
                  }}>
                    {item.name}
                  </h3>
                  <p style={{
                    color: '#FF0000',
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    marginBottom: '1rem',
                  }}>
                    {item.price}
                  </p>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      style={{
                        background: 'rgba(255,0,0,0.1)',
                        border: '1px solid rgba(255,0,0,0.3)',
                        color: '#FF0000',
                        padding: '0.5rem',
                        borderRadius: 6,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <Minus size={16} />
                    </button>
                    <span style={{ color: '#f0f0ee', minWidth: '2rem', textAlign: 'center' }}>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      style={{
                        background: 'rgba(255,0,0,0.1)',
                        border: '1px solid rgba(255,0,0,0.3)',
                        color: '#FF0000',
                        padding: '0.5rem',
                        borderRadius: 6,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <Plus size={16} />
                    </button>
                    <button
                      onClick={() => removeItem(item.productId)}
                      style={{
                        background: 'rgba(255,0,0,0.1)',
                        border: '1px solid rgba(255,0,0,0.3)',
                        color: '#FF0000',
                        padding: '0.5rem',
                        borderRadius: 6,
                        cursor: 'pointer',
                        marginLeft: 'auto',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
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
              justifyContent: 'space-between',
              marginBottom: '1rem',
              paddingBottom: '1rem',
              borderBottom: '1px solid rgba(255,255,255,0.1)',
            }}>
              <span style={{ color: '#9ca3af' }}>Артикули:</span>
              <span style={{ color: '#f0f0ee', fontWeight: 600 }}>{items.length}</span>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '1.5rem',
              paddingBottom: '1rem',
              borderBottom: '1px solid rgba(255,255,255,0.1)',
            }}>
              <span style={{ color: '#9ca3af' }}>Обща цена:</span>
              <span style={{ color: '#FF0000', fontWeight: 700, fontSize: '1.25rem' }}>
                {totalPrice.toFixed(2)} лв
              </span>
            </div>
            <button
              onClick={() => setLocation('/checkout')}
              style={{
                width: '100%',
                padding: '0.85rem',
                background: '#FF0000',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                fontWeight: 600,
                cursor: 'pointer',
                marginBottom: '0.75rem',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = '#FF3333';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = '#FF0000';
              }}
            >
              Към касата
            </button>
            <button
              onClick={() => setLocation('/catalog')}
              style={{
                width: '100%',
                padding: '0.85rem',
                background: 'transparent',
                color: '#FF0000',
                border: '1px solid rgba(255,0,0,0.3)',
                borderRadius: 8,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(255,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = 'transparent';
              }}
            >
              Продължи пазаруването
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
