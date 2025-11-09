import TodoClient from "./todoClient";

export default async function Page({ params }) {
  const id = params.slug.replace("todo-", "");

  const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

  const res = await fetch(`${baseURL}/api/todo/${id}`, {
    method: "GET",
    cache: "no-store",
  });

  if (!res.ok) {
    return (
      <div className="w-full text-center mt-20 text-neutral-700">
        Todo not found.
      </div>
    );
  }

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
