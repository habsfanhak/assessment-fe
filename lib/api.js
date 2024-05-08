

export async function addTask(taskName, taskDescription, taskStatus, taskPriority, dateAdded) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tasks`, {
      method: 'POST',
      body: JSON.stringify({taskName, taskDescription, taskStatus, taskPriority, dateAdded}),
      headers: {
        'content-type': 'application/json',
      },
    });
  
    const data = await res.json();

    if (res.status === 200) {
        return data;
    } else {
        throw new Error(data.error);
    }
}

export async function getTasks() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tasks`, {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
      },
    });
  
    if (res.status === 200) {
        const data = await res.json();
        return data;
    } else {
        throw new Error(data.message);
    }
}

export async function updateTask(_id, taskName, taskDescription, taskStatus, taskPriority) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tasks`, {
      method: 'PATCH',
      body: JSON.stringify({_id, taskName, taskDescription, taskStatus, taskPriority}),
      headers: {
        'content-type': 'application/json',
      },
    });
  
    if (res.status === 200) {
        const data = await res.json();
        return data;
    } else {
        throw new Error(data.message);
    }
}

export async function deleteTask(_id) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tasks`, {
      method: 'DELETE',
      body: JSON.stringify({_id}),
      headers: {
        'content-type': 'application/json',
      },
    });
  
    if (res.status === 200) {
        const data = await res.json();
        return data;
    } else {
        throw new Error(data.message);
    }
}