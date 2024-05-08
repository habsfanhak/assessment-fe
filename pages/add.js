import { Container, Row, Col } from "react-bootstrap"
import { Form, Button, Alert } from "react-bootstrap"
import { useState } from "react"

import { addTask } from "@/lib/api"

import Head from "next/head"
import { useRouter } from "next/router"

export default function AddTask() {
    //Form Variables
    const [taskName, setTaskName] = useState("")
    const [taskDescriptionName, setTaskDescriptionName] = useState("")
    const [taskStatus, setTaskStatus] = useState("Incomplete")
    const [taskPriority, setTaskPriority] = useState("")

    //Router
    const router = useRouter()

    //Messages
    const [success, setSuccess] = useState("")
    const [warning, setWarning] = useState("")

    //Handles button onSubmit to add task
    async function handleSubmit(e) {
        e.preventDefault();
        const dateAdded = new Date()   

        try{
            await addTask(taskName, taskDescriptionName, taskStatus, taskPriority, dateAdded);    
            setSuccess("Task added successfully.")
            router.reload()

        }catch(err){
            setWarning("Error submitting task.")
            setSuccess("")
        }
    }

    return (
        <>
            <Head>
                <title>
                    Add Task
                </title>
                <meta name="description" content="Fill out the form to create a task for you to manage."></meta>
            </Head>

            <Container>
                <br/>
                <h2>Add a Task</h2>
                <hr/>
                <Form onSubmit={handleSubmit}>
                    <Form.Label>Task Name:</Form.Label>
                    <Form.Control required type="text" value={taskName} id="taskName" name="taskName" onChange={e => setTaskName(e.target.value)} />
                    <br/>

                    <Form.Label>Task Description:</Form.Label>
                    <Form.Control required type="text" value={taskDescriptionName} id="taskDescriptionName" name="taskDescriptionName" as="textarea" rows="3" onChange={e => setTaskDescriptionName(e.target.value)} />
                    <br/>

                    <Row>
                        <Col md={6} xs={12} style={{marginBottom: "20px"}}>
                            <Form.Label>Task Status</Form.Label>
                            <Form.Select id="taskStatus" name="taskStatus" onChange={e => setTaskStatus(e.target.value)} required>
                                <option value="Incomplete" selected>Incomplete</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                            </Form.Select>
                        </Col>

                        <Col md={6} xs={12} style={{marginBottom: "20px"}}>
                            <Form.Label>Task Priority</Form.Label>
                            <Form.Select id="taskPriority" name="taskPriority" value={taskPriority} onChange={e => setTaskPriority(e.target.value)} required>
                                <option value="" disabled></option>
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                            </Form.Select>
                        </Col>
                    </Row>

                    <Button type="submit" variant="outline-success">Submit</Button>
                    <br/><br/>
                    {success && <Alert variant="success">{success}</Alert>}
                    {warning && <Alert variant="danger">{warning}</Alert>}
                </Form>
                
            </Container>
        </>
    )
}