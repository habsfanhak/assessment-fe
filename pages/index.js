import { Container, Row, Col, Card, Form, Tabs, Tab, Offcanvas, Button, Alert } from "react-bootstrap"

import { getTasks, updateTask, deleteTask } from "@/lib/api"
import { useAtom } from "jotai"
import { dataAtom } from "@/store"
import { dateFormatted, timestamp } from "@/lib/utility"

import { useEffect } from "react"
import { useState } from "react"
import { useRouter } from "next/router"

import styles from '../styles/Home.module.css'
import Image from "next/image"
import Head from "next/head"

export default function Home() {
  //State Variables for Data
  const [data, setData] = useAtom(dataAtom)
  const [dataCopy, setDataCopy] = useState([])

  //Search Val
  const [search, setSearch] = useState("")

  //Router
  const router = useRouter()

  //OffCanvas Essentials
  const [showCanvas, setShowCanvas] = useState(false);
  const [activeObject, setActiveObject] = useState(null)

  //Filtering
  const [sortVal, setSortVal] = useState("")
  const [key, setKey] = useState("All Tasks");

  //Form Variables for Editing
  const [taskName, setTaskName] = useState("")
  const [taskDescriptionName, setTaskDescriptionName] = useState("")
  const [taskStatus, setTaskStatus] = useState("Incomplete")
  const [taskPriority, setTaskPriority] = useState("")

  //Messages
  const [success, setSuccess] = useState("")
  const [warning, setWarning] = useState("")

  //Functions to handle offcanvas show ops
  function handleCloseCanvas() {
    setShowCanvas(false);
    router.reload()
  }
  function handleShowCanvas(object) {
    setActiveObject(object)

    setTaskName(object.taskName)
    setTaskDescriptionName(object.taskDescription)
    setTaskStatus(object.taskStatus)
    setTaskPriority(object.taskPriority)

    setShowCanvas(true);
  }

  //Calling the API route to update the data atom
  async function updateData() {
    await setData(getTasks())
  }

  //Populating the Atom on Load
  useEffect(() => {
    if (!data) {
      updateData();
      setDataCopy(data)
    }
  }, []);

  //Populating the datacopy when data has been updated
  useEffect(() => {
    setDataCopy(data)
  }, [data])

  //Function to filter the data based on the value the key was changed to
  useEffect(() => {
    if (key == "All Tasks") {
      setDataCopy(data)
      taskSearch()
    }
    else {
      const filter = data.filter(task => {
        if (key === "Active Tasks") {
          return (task.taskStatus != "Completed");
        } else if (key === "Completed Tasks") {
          return task.taskStatus === "Completed";
        }
        return true; // Default case
      });

      const searchFiltered = keyCaseFilter(filter)

      setDataCopy(searchFiltered)
      handleSort(sortVal)
    }

  }, [key])

  //Filtering in the case where the key was updated so filtered results are further filtered
  function keyCaseFilter(filteredData) {
    if (search.length == 0) {
      return filteredData
    }

    filteredData = filteredData.filter(task => {
      const taskNameMatches = task.taskName.toLowerCase().includes(search.toLowerCase());
      const taskDescriptionMatches = task.taskDescription.toLowerCase().includes(search.toLowerCase());
      return taskNameMatches || taskDescriptionMatches;
    })

    return filteredData;
  }

  //Filters data based on search field val
  function taskSearch() {
    if (search.length == 0) {
      return setDataCopy(data)
    }

    const filteredData = data.filter(task => {
      const taskNameMatches = task.taskName.toLowerCase().includes(search.toLowerCase());
      const taskDescriptionMatches = task.taskDescription.toLowerCase().includes(search.toLowerCase());
      return taskNameMatches || taskDescriptionMatches;
    })

    setDataCopy(filteredData);
  }
  
  //Adding this function to change up conditional styling based on each cards individual priority
  function priorityStyle(priority) {
    switch (priority) {
      case 'Low':
        return styles.low_priority_card;
      case 'Medium':
        return styles.medium_priority_card;
      case 'High':
        return styles.high_priority_card;
      default:
        return '';
    }
  }

  //Handles the refresh button onClick
  function reload() {
    router.reload()
  }

  //Handles the sort after the user selects a value out of the select field
  function handleSort(sortType) {
    setSortVal(sortType)

    //Sorting based on the given value
    if (sortType === "Priority") {
      dataCopy.sort((a, b) => {
        if (a.taskPriority === "High" && b.taskPriority !== "High") return -1
        if (a.taskPriority === "Medium" && b.taskPriority !== "High") return -1
        return 0
      })
    } 
    else if (sortType === "Date Added") {
      dataCopy.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded))
    } 
    else if (sortType === "Status") {
      dataCopy.sort((a, b) => {
        if (a.taskStatus === "Incomplete" && b.taskStatus !== "Incomplete") return -1
        if (a.taskStatus === "In Progress" && b.taskStatus !== "Incomplete") return -1
        return 0
      })
    }
  }

  //Editing the task
  async function handleSubmit(e) {
    e.preventDefault();  

    try{
        await updateTask(activeObject._id, taskName, taskDescriptionName, taskStatus, taskPriority);    
        setSuccess("Task updated successfully.")
        setWarning("")

    }catch(err){
        setWarning("Error updating task.")
        setSuccess("")
    }
  }

  //Deleting a Task
  async function handleDelete() {
    try{
        await deleteTask(activeObject._id);    
        setSuccess("Task deleted successfully.")
        setWarning("")

    }catch(err){
        setWarning("Error deleting task.")
        setSuccess("")
    }
  }

  //Making sure we dont render when data isn't yet loaded
  if (!data || !dataCopy) {
    return null;
  }

  return (
    <>
    <Head>
      <title>
          Home
      </title>
      <meta name="description" content="Details of your tasks and forms to edit and delete the ones you've created."></meta>
    </Head>
      <Container>
        <br />
        <div style={{float: 'right'}}>
          {timestamp()}
        </div>
        <h2>Tasks</h2>
        <hr/>
        <Row>
          <Col md={6} xs={12}>
              <Form.Label>Search</Form.Label>
              <Form.Control required type="text" id="searchTask" name="searchTask" onChange={e => setSearch(e.target.value)} />
          </Col>
          <Col md={6} xs={12}>
            <Form.Label>Sort By</Form.Label>
            <Form.Select id="sortTask" name="sortTask" onChange={e => handleSort(e.target.value)}>
                <option value="" selected disabled></option>
                <option value="Priority">Priority</option>
                <option value="Status">Status</option>
                <option value="Date Added">Date Added</option>
            </Form.Select>
          </Col>
        </Row>
        <br/>

          <Button variant="outline-primary"  onClick={() => taskSearch()}>Search</Button>
          <Image src="/refresh.svg" height={37} width={37} className={`rounded ${styles.refresh_btn}`} onClick={() => reload()}/>

        <br/><br/>

      <Tabs
      id="controlled-tab-example"
      activeKey={key}
      onSelect={(k) => setKey(k)}
      className="mb-3">

        <Tab eventKey="All Tasks" title="All Tasks">
        </Tab>
        <Tab eventKey="Active Tasks" title="Active Tasks">
        </Tab>
        <Tab eventKey="Completed Tasks" title="Completed Tasks">
        </Tab>
      </Tabs>
        <Row>
            {dataCopy.map(task => (
              <Col md={3} xs={12} key={task._id}>
                <Card className={`${styles.custom_card} ${priorityStyle(task.taskPriority)}`}>
                  <Card.Header className="text-center"><b>{task.taskPriority} Priority</b></Card.Header>
                  <Card.Body>
                    <Card.Title>{task.taskName}</Card.Title>
                    <Card.Text>{task.taskDescription}</Card.Text>
                    <Card.Text>Status: {task.taskStatus}</Card.Text>
                    <Image style={{float: 'right', cursor: "pointer"}} src="/edit.svg" alt="Click here to edit this task" height={25} width={25} onClick={() => handleShowCanvas(task)}/>
                  </Card.Body>
                </Card>
              </Col>
            ))}
        </Row>
      </Container>

      <Offcanvas show={showCanvas} onHide={handleCloseCanvas}>
        {activeObject && <>
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>{activeObject.taskName}</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
          <b>Task ID: </b>{activeObject.taskId}
          <br/><br/>

          <b>Date Added: </b>{dateFormatted(activeObject.dateAdded)}
          <br/><br/>

          <Form onSubmit={handleSubmit}>
            <Form.Label>Task Name:</Form.Label>
            <Form.Control required type="text" defaultValue={activeObject.taskName} id="taskName" name="taskName" onChange={e => setTaskName(e.target.value)} />
            <br/>

            <Form.Label>Task Description:</Form.Label>
            <Form.Control as="textarea" required type="text" defaultValue={activeObject.taskDescription} id="taskDescription" name="taskDescription" onChange={e => setTaskDescriptionName(e.target.value)} />
            <br/>

            <Form.Label>Task Status</Form.Label>
            <Form.Select id="taskStatus" name="taskStatus" defaultValue={activeObject.taskStatus} onChange={e => setTaskStatus(e.target.value)} required>
                <option value="Incomplete">Incomplete</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
            </Form.Select>
            <br/>

            <Form.Label>Task Priority</Form.Label>
              <Form.Select id="taskPriority" name="taskPriority" defaultValue={activeObject.taskPriority} onChange={e => setTaskPriority(e.target.value)} required>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
              </Form.Select>
              <br/>

            <Button type="submit" variant="outline-success">Update</Button>
            <br/>
            <hr/>
            <Button variant="danger" onClick={handleDelete}>Delete</Button>
            <br/><br/>
            {success && <Alert variant="success">{success}</Alert>}
            {warning && <Alert variant="danger">{warning}</Alert>}
          </Form>
          </Offcanvas.Body>
        </>}
      </Offcanvas>
    </>
  )
}