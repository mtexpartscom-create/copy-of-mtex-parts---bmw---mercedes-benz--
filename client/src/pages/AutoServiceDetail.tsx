import { useState } from "react";
import { Phone, MapPin, Clock, CheckCircle2, Star, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const SERVICES = [
  {
    title: "Ремонт на двигатели",
    icon: "⚙️",
    items: ["Смяна на гарнитури", "Вериги", "Турбини", "Дюзи", "Ангренаж"],
  },
  {
    title: "Ходова част",
    icon: "🔧",
    items: ["Носачи", "Тампони", "Амортисьори", "Шарнири", "Кормилни накрайници"],
  },
  {
    title: "Спирачна система",
    icon: "🛑",
    items: ["Дискове", "Накладки", "Апарати", "Спирачни маркучи"],
  },
  {
    title: "Автоклиматици",
    icon: "❄️",
    items: ["Зареждане", "Диагностика", "Откриване на течове", "Смяна на компресори"],
  },
  {
    title: "Компютърна диагностика",
    icon: "💻",
    items: ["Изчистване на грешки", "Кодиране", "Адаптации", "Проверка на живи данни"],
  },
  {
    title: "Смяна на масла и консумативи",
    icon: "🛢️",
    items: ["Масло двигател", "Масло автоматична кутия", "Филтри", "Антифриз"],
  },
];

const ADVANTAGES = [
  "Опитни механици",
  "Части на склад от автоморгата",
  "Бързо обслужване",
  "Гаранция за ремонта",
  "Коректни цени",
];

export default function AutoServiceDetail() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    service: "",
    date: "",
    time: "",
    description: "",
  });

  const createBookingMutation = trpc.crm.bookings.createPublic.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim()) {
      toast.error("Моля, въведете име");
      return;
    }
    if (!formData.phone.trim()) {
      toast.error("Моля, въведете телефонен номер");
      return;
    }
    if (!formData.service) {
      toast.error("Моля, изберете услуга");
      return;
    }
    if (!formData.date) {
      toast.error("Моля, изберете дата");
      return;
    }
    if (!formData.time) {
      toast.error("Моля, изберете час");
      return;
    }

    try {
      // Combine date and time into ISO datetime
      const bookingDateTime = new Date(`${formData.date}T${formData.time}`);
      
      await createBookingMutation.mutateAsync({
        name: formData.name,
        phone: formData.phone,
        serviceType: formData.service,
        bookingDate: bookingDateTime,
        description: formData.description,
      });
      
      toast.success("Резервацията е създадена успешно! Ще се свържем с вас скоро.");
      
      // Reset form
      setFormData({
        name: "",
        phone: "",
        service: "",
        date: "",
        time: "",
        description: "",
      });
    } catch (error) {
      console.error("Booking error:", error);
      toast.error("Грешка при създаване на резервация. Моля, опитайте отново.");
    }
  };

  return (
    <div style={{ background: "#0d0e10", minHeight: "100vh" }}>
      <Navbar />

      {/* Hero Section */}
      <div style={{
        background: "linear-gradient(135deg, #1a1d22 0%, #15171a 100%)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        padding: "4rem 0",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 2rem",
          position: "relative",
          zIndex: 1,
        }}>
          <h1 style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 800,
            fontSize: "clamp(2.8rem, 6vw, 5rem)",
            lineHeight: 1.08,
            letterSpacing: "-0.03em",
            color: "#f0f0ee",
            marginBottom: "1.5rem",
          }}>
            Автосервиз<br />
            <span style={{ color: "#2563eb" }}>MTEX PARTS</span>
          </h1>
          <p style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: "1.1rem",
            color: "#9ca3af",
            lineHeight: 1.6,
            maxWidth: "600px",
            marginBottom: "2rem",
          }}>
            Професионален ремонт и диагностика за BMW и Mercedes-Benz
          </p>
          
          {/* Service Tags */}
          <div style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.75rem",
            marginBottom: "2rem",
          }}>
            {["Диагностика", "Ремонт двигатели", "Ходова част", "Автоклиматици", "Смяна масла", "Компютърна диагностика"].map((tag) => (
              <span key={tag} style={{
                background: "rgba(37,99,235,0.1)",
                border: "1px solid rgba(37,99,235,0.3)",
                color: "#2563eb",
                padding: "0.5rem 1rem",
                borderRadius: "20px",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: "0.875rem",
              }}>
                {tag}
              </span>
            ))}
          </div>

          {/* CTA Buttons */}
          <div style={{
            display: "flex",
            gap: "1rem",
            flexWrap: "wrap",
          }}>
            <Button style={{
              background: "#2563eb",
              color: "#f0f0ee",
              border: "none",
              padding: "0.75rem 1.5rem",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}>
              <Calendar size={18} />
              Запази час
            </Button>
            <Button style={{
              background: "transparent",
              color: "#2563eb",
              border: "1px solid #2563eb",
              padding: "0.75rem 1.5rem",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}>
              <Phone size={18} />
              Обади се
            </Button>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div style={{
        background: "#0d0e10",
        padding: "4rem 0",
      }}>
        <div style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 2rem",
        }}>
          <h2 style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 800,
            fontSize: "2.5rem",
            color: "#f0f0ee",
            marginBottom: "3rem",
            textAlign: "center",
          }}>
            Наши услуги
          </h2>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "1.5rem",
          }}>
            {SERVICES.map((service) => (
              <div
                key={service.title}
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.05)",
                  borderRadius: "12px",
                  padding: "1.5rem",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "rgba(37,99,235,0.5)";
                  e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)";
                  e.currentTarget.style.background = "rgba(255,255,255,0.02)";
                }}
              >
                <div style={{
                  fontSize: "2.5rem",
                  marginBottom: "1rem",
                }}>
                  {service.icon}
                </div>
                <h3 style={{
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 700,
                  fontSize: "1.1rem",
                  color: "#f0f0ee",
                  marginBottom: "1rem",
                }}>
                  {service.title}
                </h3>
                <ul style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                }}>
                  {service.items.map((item) => (
                    <li key={item} style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "0.75rem",
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontSize: "0.9rem",
                      color: "#9ca3af",
                    }}>
                      <CheckCircle2 size={16} style={{
                        color: "#2563eb",
                        flexShrink: 0,
                        marginTop: "0.25rem",
                      }} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Booking Form Section */}
      <div style={{
        background: "linear-gradient(135deg, rgba(37,99,235,0.05) 0%, rgba(37,99,235,0.02) 100%)",
        borderTop: "1px solid rgba(37,99,235,0.1)",
        borderBottom: "1px solid rgba(37,99,235,0.1)",
        padding: "4rem 0",
      }}>
        <div style={{
          maxWidth: "600px",
          margin: "0 auto",
          padding: "0 2rem",
        }}>
          <h2 style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 800,
            fontSize: "2.5rem",
            color: "#f0f0ee",
            marginBottom: "2rem",
            textAlign: "center",
          }}>
            Онлайн записване
          </h2>

          <form onSubmit={handleSubmit} style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}>
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
            }}>
              <Input
                placeholder="Име"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.05)",
                  color: "#f0f0ee",
                  padding: "0.75rem",
                  borderRadius: "8px",
                }}
              />
              <Input
                placeholder="Телефонен номер"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.05)",
                  color: "#f0f0ee",
                  padding: "0.75rem",
                  borderRadius: "8px",
                }}
              />
            </div>

            <Select value={formData.service} onValueChange={(value) => setFormData({ ...formData, service: value })}>
              <SelectTrigger style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.05)",
                color: "#f0f0ee",
                padding: "0.75rem",
                borderRadius: "8px",
              }}>
                <SelectValue placeholder="Избери услуга" />
              </SelectTrigger>
              <SelectContent>
                {SERVICES.map((service) => (
                  <SelectItem key={service.title} value={service.title}>
                    {service.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
            }}>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.05)",
                  color: "#f0f0ee",
                  padding: "0.75rem",
                  borderRadius: "8px",
                }}
              />
              <Input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.05)",
                  color: "#f0f0ee",
                  padding: "0.75rem",
                  borderRadius: "8px",
                }}
              />
            </div>

            <Textarea
              placeholder="Описание на проблема"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.05)",
                color: "#f0f0ee",
                padding: "0.75rem",
                borderRadius: "8px",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                minHeight: "120px",
              }}
            />

            <Button 
              type="submit"
              style={{
                background: "#2563eb",
                color: "#f0f0ee",
                border: "none",
                padding: "0.75rem",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "1rem",
                marginTop: "1rem",
              }}
              disabled={createBookingMutation.isPending}
            >
              {createBookingMutation.isPending ? "Запазване..." : "Запази час"}
            </Button>
          </form>
        </div>
      </div>

      {/* Advantages Section */}
      <div style={{
        background: "#0d0e10",
        padding: "4rem 0",
      }}>
        <div style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 2rem",
        }}>
          <h2 style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 800,
            fontSize: "2.5rem",
            color: "#f0f0ee",
            marginBottom: "3rem",
            textAlign: "center",
          }}>
            Защо да изберете нас
          </h2>

          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "2rem",
          }}>
            <div>
              <ul style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
              }}>
                {ADVANTAGES.map((advantage) => (
                  <li key={advantage} style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: "1rem",
                    color: "#9ca3af",
                  }}>
                    <Star size={20} style={{
                      color: "#2563eb",
                      flexShrink: 0,
                    }} />
                    <span>{advantage}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.05)",
              borderRadius: "12px",
              padding: "2rem",
            }}>
              <p style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: "1rem",
                color: "#9ca3af",
                lineHeight: 1.8,
                marginBottom: "1.5rem",
                fontStyle: "italic",
              }}>
                "Разполагаме със собствен склад за нови и употребявани авточасти, което позволява по-бърз и по-евтин ремонт."
              </p>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                color: "#2563eb",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 600,
              }}>
                <Clock size={20} />
                <span>Бързо обслужване</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Section */}
      <div style={{
        background: "linear-gradient(135deg, rgba(37,99,235,0.05) 0%, rgba(37,99,235,0.02) 100%)",
        borderTop: "1px solid rgba(37,99,235,0.1)",
        padding: "4rem 0",
      }}>
        <div style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 2rem",
        }}>
          <h2 style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 800,
            fontSize: "2.5rem",
            color: "#f0f0ee",
            marginBottom: "3rem",
            textAlign: "center",
          }}>
            Галерия
          </h2>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "1.5rem",
          }}>
            {[
              { icon: "🏢", label: "Сервиза" },
              { icon: "🔧", label: "Подемниците" },
              { icon: "💻", label: "Диагностиката" },
              { icon: "🔨", label: "Ремонти" },
              { icon: "👷", label: "Работния процес" },
              { icon: "✅", label: "Готови автомобили" },
            ].map((item) => (
              <div
                key={item.label}
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.05)",
                  borderRadius: "12px",
                  height: "250px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "rgba(37,99,235,0.5)";
                  e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)";
                  e.currentTarget.style.background = "rgba(255,255,255,0.02)";
                }}
              >
                <div style={{
                  textAlign: "center",
                }}>
                  <div style={{
                    fontSize: "3rem",
                    marginBottom: "0.75rem",
                  }}>
                    {item.icon}
                  </div>
                  <p style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    color: "#9ca3af",
                    fontSize: "0.95rem",
                  }}>
                    {item.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div style={{
        background: "#0d0e10",
        padding: "4rem 0",
      }}>
        <div style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 2rem",
        }}>
          <h2 style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 800,
            fontSize: "2.5rem",
            color: "#f0f0ee",
            marginBottom: "3rem",
            textAlign: "center",
          }}>
            Контактна информация
          </h2>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "2rem",
          }}>
            <div style={{
              textAlign: "center",
            }}>
              <Phone size={32} style={{
                color: "#2563eb",
                margin: "0 auto 1rem",
              }} />
              <h3 style={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 700,
                fontSize: "1.1rem",
                color: "#f0f0ee",
                marginBottom: "0.5rem",
              }}>
                Телефон
              </h3>
              <p style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                color: "#9ca3af",
              }}>
                +359 2 XXX XXXX
              </p>
            </div>

            <div style={{
              textAlign: "center",
            }}>
              <MapPin size={32} style={{
                color: "#2563eb",
                margin: "0 auto 1rem",
              }} />
              <h3 style={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 700,
                fontSize: "1.1rem",
                color: "#f0f0ee",
                marginBottom: "0.5rem",
              }}>
                Адрес
              </h3>
              <p style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                color: "#9ca3af",
              }}>
                ул. XXXX, София
              </p>
            </div>

            <div style={{
              textAlign: "center",
            }}>
              <Clock size={32} style={{
                color: "#2563eb",
                margin: "0 auto 1rem",
              }} />
              <h3 style={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 700,
                fontSize: "1.1rem",
                color: "#f0f0ee",
                marginBottom: "0.5rem",
              }}>
                Работно време
              </h3>
              <p style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                color: "#9ca3af",
              }}>
                Пн-Пт: 08:00-18:00
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
