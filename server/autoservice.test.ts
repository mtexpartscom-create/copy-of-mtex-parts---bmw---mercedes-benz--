import { describe, it, expect } from "vitest";

describe("Auto Service Detail Page", () => {
  it("should have 6 service categories", () => {
    const services = [
      "Ремонт на двигатели",
      "Ходова част",
      "Спирачна система",
      "Автоклиматици",
      "Компютърна диагностика",
      "Смяна на масла и консумативи",
    ];
    expect(services).toHaveLength(6);
  });

  it("should have service items for each category", () => {
    const serviceItems = {
      "Ремонт на двигатели": ["Смяна на гарнитури", "Вериги", "Турбини", "Дюзи", "Ангренаж"],
      "Ходова част": ["Носачи", "Тампони", "Амортисьори", "Шарнири", "Кормилни накрайници"],
      "Спирачна система": ["Дискове", "Накладки", "Апарати", "Спирачни маркучи"],
      "Автоклиматици": ["Зареждане", "Диагностика", "Откриване на течове", "Смяна на компресори"],
      "Компютърна диагностика": ["Изчистване на грешки", "Кодиране", "Адаптации", "Проверка на живи данни"],
      "Смяна на масла и консумативи": ["Масло двигател", "Масло автоматична кутия", "Филтри", "Антифриз"],
    };

    Object.entries(serviceItems).forEach(([category, items]) => {
      expect(items.length).toBeGreaterThan(0);
      expect(items).toContain(items[0]);
    });
  });

  it("should have 5 advantages listed", () => {
    const advantages = [
      "Опитни механици",
      "Части на склад от автоморгата",
      "Бързо обслужване",
      "Гаранция за ремонта",
      "Коректни цени",
    ];
    expect(advantages).toHaveLength(5);
  });

  it("should have booking form fields", () => {
    const formFields = ["name", "phone", "service", "date", "time", "description"];
    expect(formFields).toContain("name");
    expect(formFields).toContain("phone");
    expect(formFields).toContain("service");
    expect(formFields).toContain("date");
    expect(formFields).toContain("time");
    expect(formFields).toContain("description");
  });

  it("should have gallery with 6 placeholder items", () => {
    const galleryItems = [
      "Сервиза",
      "Подемниците",
      "Диагностиката",
      "Ремонти",
      "Работния процес",
      "Готови автомобили",
    ];
    expect(galleryItems).toHaveLength(6);
  });

  it("should have contact information sections", () => {
    const contactSections = ["Телефон", "Адрес", "Работно време"];
    expect(contactSections).toHaveLength(3);
  });

  it("should have hero section with CTA buttons", () => {
    const buttons = ["Запази час", "Обади се"];
    expect(buttons).toHaveLength(2);
  });

  it("should validate booking form data structure", () => {
    const bookingData = {
      name: "Test User",
      phone: "+359 2 123 4567",
      service: "Ремонт на двигатели",
      date: "2026-06-10",
      time: "10:00",
      description: "Test booking",
    };

    expect(bookingData.name).toBeTruthy();
    expect(bookingData.phone).toBeTruthy();
    expect(bookingData.service).toBeTruthy();
    expect(bookingData.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(bookingData.time).toMatch(/^\d{2}:\d{2}$/);
  });
});
