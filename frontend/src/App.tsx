import { useEffect, useState, useRef, FormEvent } from "react";
import { FiTrash } from "react-icons/fi";
import { api } from "./services/api";

// Tipando a resposta da API
interface CustomerProps {
  id: string;
  name: string;
  email: string;
  status: boolean;
  created_at: string;
}

function App() {

  // useState tipado
  const [customers, setCustomers] = useState<CustomerProps[]>([]);
  const nameRef = useRef<HTMLInputElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);

  // Criando o useEffect para carregar nossa função assíncrona, que traz os dados da base url da API;
  // [] após a função anônima define que a função loadCustomers() será executada somente uma vez.
  useEffect(() => {
    loadCustomers();
  }, [])

  // Função que traz os dados da API para a aplicação :)
  async function loadCustomers() {
    const response = await api.get("/customers");
    setCustomers(response.data);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (!nameRef.current?.value || !emailRef.current?.value) return;

    const response = await api.post("/customer", {
      name: nameRef.current?.value,
      email: emailRef.current?.value
    })

    setCustomers(allCustomers => [...allCustomers, response.data]);

    nameRef.current.value = "";
    emailRef.current.value = "";
  }

  async function handleDelete(id: string) {
    try {
      await api.delete("/customer", {
        params: {
          id: id,
        }
      })

      const allCustomers = customers.filter((customer) => customer.id !== id);
      setCustomers(allCustomers);

    } catch (error) {
      alert(error);
    }
  }

  return (
    <div
      className="w-full min-h-screen bg-gray-900 flex justify-center px-4"
    >
      <main
        className="my-10 w-full md:max-w-2xl"
      >

        <h1
          className="text-4xl font-medium text-white"
        >Clientes</h1>
        <form
          className="flex flex-col my-6"
          onSubmit={handleSubmit}
        >

          <label
            className="font-medium text-white"
            htmlFor="name"
          >
            Nome
          </label>
          <input
            type="text"
            id="name"
            placeholder="Digite seu nome completo..."
            className="w-full mb-5 p-2 rounded outline-none"
            ref={nameRef}
          />
          <label
            className="font-medium text-white"
            htmlFor="email"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            placeholder="Digite seu nome completo..."
            className="w-full mb-5 p-2 rounded outline-none"
            ref={emailRef}
          />

          <input
            type="submit"
            value="Cadastrar"
            className="cursor-pointer w-full p-2 bg-green-500 rounded font-medium text-white hover:shadow-lg hover:shadow-green-400/50"
          />

        </form>

        <section
          className="flex flex-col gap-4"
        >

          {customers.map((customer) => (

            <article
              className="w-full bg-white rounded p-2 relative hover:scale-105 duration-200"
              key={customer.id}
            >

              <p><span className="font-medium">Nome:</span> {customer.name}</p>
              <p><span className="font-medium">Email:</span> {customer.email}</p>
              <p><span className="font-medium">Status:</span> {customer.status ? "Ativo" : "Inativo"}</p>

              <button
                className="bg-red-500 w-7 h-7 flex items-center justify-center rounded-lg absolute right-0 -top-2"
                onClick={() => handleDelete(customer.id)}
              >
                <FiTrash
                  size={18}
                  color="#fff"
                />
              </button>

            </article>

          ))}

        </section>

      </main>
    </div>
  )
}

export default App
