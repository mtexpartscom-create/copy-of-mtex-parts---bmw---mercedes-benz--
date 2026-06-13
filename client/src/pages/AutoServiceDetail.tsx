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
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Hero Banner */}
      <section className="relative h-96 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-red-600/20" />
        <div className="relative h-full flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-5xl font-bold mb-4">Автосервиз MTEXPARTS</h1>
            <p className="text-xl text-gray-300 mb-8">Професионален ремонт за BMW и Mercedes-Benz</p>
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              <span className="bg-blue-600/20 border border-blue-500 rounded-full px-4 py-2">Диагностика</span>
              <span className="bg-blue-600/20 border border-blue-500 rounded-full px-4 py-2">Ремонт на двигатели</span>
              <span className="bg-blue-600/20 border border-blue-500 rounded-full px-4 py-2">Ходова част</span>
              <span className="bg-blue-600/20 border border-blue-500 rounded-full px-4 py-2">Автоклиматици</span>
              <span className="bg-blue-600/20 border border-blue-500 rounded-full px-4 py-2">Смяна на масла</span>
              <span className="bg-blue-600/20 border border-blue-500 rounded-full px-4 py-2">Компютърна диагностика</span>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Calendar className="mr-2 h-4 w-4" />
                Запази час
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white/10">
                <Phone className="mr-2 h-4 w-4" />
                Обади се
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-12 text-center">Наши услуги</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((service) => (
              <div
                key={service.title}
                className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:border-blue-500 transition"
              >
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-bold text-white mb-4">{service.title}</h3>
                <ul className="space-y-2">
                  {service.items.map((item) => (
                    <li key={item} className="flex items-start text-gray-300">
                      <CheckCircle2 className="h-4 w-4 mr-2 mt-1 text-blue-500 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Form */}
      <section className="py-16 px-4 bg-slate-800/30">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-12 text-center">Онлайн записване</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="Име"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-slate-700 border-slate-600 text-white"
              />
              <Input
                placeholder="Телефонен номер"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>

            <Select value={formData.service} onValueChange={(value) => setFormData({ ...formData, service: value })}>
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="bg-slate-700 border-slate-600 text-white"
              />
              <Input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>

            <Textarea
              placeholder="Описание на проблема"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="bg-slate-700 border-slate-600 text-white"
              rows={4}
            />

            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              disabled={createBookingMutation.isPending}
            >
              {createBookingMutation.isPending ? "Запазване..." : "Запази час"}
            </Button>
          </form>
        </div>
      </section>

      {/* Advantages */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-12 text-center">Защо да изберете нас</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div>
              <ul className="space-y-4">
                {ADVANTAGES.map((advantage) => (
                  <li key={advantage} className="flex items-center text-gray-300">
                    <Star className="h-5 w-5 mr-3 text-blue-500" />
                    <span>{advantage}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8">
              <p className="text-gray-300 italic text-lg mb-4">
                "Разполагаме със собствен склад за нови и употребявани авточасти, което позволява по-бърз и по-евтин ремонт."
              </p>
              <div className="flex items-center text-blue-500">
                <Clock className="h-5 w-5 mr-2" />
                <span>Бързо обслужване</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-16 px-4 bg-slate-800/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-12 text-center">Галерия</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-600/20 to-blue-900/20 rounded-lg h-64 flex items-center justify-center border border-slate-700">
              <div className="text-center">
                <div className="text-4xl mb-2">🏢</div>
                <p className="text-gray-400">Сервиза</p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-600/20 to-blue-900/20 rounded-lg h-64 flex items-center justify-center border border-slate-700">
              <div className="text-center">
                <div className="text-4xl mb-2">🔧</div>
                <p className="text-gray-400">Подемниците</p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-600/20 to-blue-900/20 rounded-lg h-64 flex items-center justify-center border border-slate-700">
              <div className="text-center">
                <div className="text-4xl mb-2">💻</div>
                <p className="text-gray-400">Диагностиката</p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-600/20 to-blue-900/20 rounded-lg h-64 flex items-center justify-center border border-slate-700">
              <div className="text-center">
                <div className="text-4xl mb-2">🔨</div>
                <p className="text-gray-400">Ремонти</p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-600/20 to-blue-900/20 rounded-lg h-64 flex items-center justify-center border border-slate-700">
              <div className="text-center">
                <div className="text-4xl mb-2">👷</div>
                <p className="text-gray-400">Работния процес</p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-600/20 to-blue-900/20 rounded-lg h-64 flex items-center justify-center border border-slate-700">
              <div className="text-center">
                <div className="text-4xl mb-2">✅</div>
                <p className="text-gray-400">Готови автомобили</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-12 text-center">Контактна информация</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <Phone className="h-8 w-8 mx-auto mb-4 text-blue-500" />
              <h3 className="font-bold text-white mb-2">Телефон</h3>
              <p className="text-gray-400">+359 2 XXX XXXX</p>
            </div>
            <div className="text-center">
              <MapPin className="h-8 w-8 mx-auto mb-4 text-blue-500" />
              <h3 className="font-bold text-white mb-2">Адрес</h3>
              <p className="text-gray-400">ул. XXXX, София</p>
            </div>
            <div className="text-center">
              <Clock className="h-8 w-8 mx-auto mb-4 text-blue-500" />
              <h3 className="font-bold text-white mb-2">Работно време</h3>
              <p className="text-gray-400">Пн-Пт: 08:00-18:00</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
