'use server';
import TodoClient from "./todoClient";
import NotFoundTodo from "./notFound";

export default async function Page({ params }) {
  const { slug } = await params;

  const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

  const res = await fetch(`${baseURL}/api/todo/${slug}`, {
    method: "GET",
    cache: "no-store",
  });

  const data = await res.json();

  if (!data.success) {
    return <NotFoundTodo />
  }

  return <TodoClient todo={data.todo} />;
}
