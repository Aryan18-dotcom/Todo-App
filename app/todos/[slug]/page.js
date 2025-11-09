import TodoClient from "./todoClient";

export default async function Page({ params }) {
  const id = params.id;

  const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

  const res = await fetch(`${baseURL}/api/todo/${id}`, {
    method: "GET",
    cache: "no-store",
  });

  const data = await res.json();

  if (!data.success) {
    return (
      <div className="w-full text-center mt-20 text-neutral-700">
        Todo not found.
      </div>
    );
  }

  return <TodoClient todo={data.todo} />;
}
