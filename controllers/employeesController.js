const data = {
  employees: require("../model/employees.json"),
};

const getAllEmployees = (req, res) => {
  res.json(data.employees);
};

const createNewEmployee = (req, res) => {
  const newBie = {
    id: data.employees?.length
      ? data.employees[data.employees.length - 1].id + 1
      : 1,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
  };

  if (!newBie.firstname || !newBie.lastname) {
    return res
      .status(400)
      .json({ success: false, message: "Provide the first and last names" });
  }
  data.employees = [...data.employees, newBie];
  res.status(200).json({ success: true, data: data.employees });
};

const updateEmployee = (req, res) => {
  const employee = data.employees.find((emp) => emp.id === req.body.id);
  if (!employee) {
    return res
      .status(404)
      .json({
        success: false,
        message: "Employee not found, Check your request body",
      });
  }
  console.log(req.body);
  const updatedEmployee = {...employee, firstname:req.body.firstname, lastname:req.body.lastname};
  const filteredEmployees = data.employees.filter(emp => emp.id !== req.body.id);
  const sortedEmployees = [...filteredEmployees, updatedEmployee].sort((a, b)=> a.id - b.id);
  data.employees = [...sortedEmployees]

  res.status(200).json({
    success:true, 
    data: data.employees,
  })
  


};

const deleteEmployee = (req, res) => {
  const employee = data.employees.find(
    (emp) => emp.id === parseInt(req.body.id)
  );
  if (!employee) {
    return res
      .status(400)
      .json({ message: `Employee ID ${req.body.id} not found` });
  }
  const filteredArray = data.employees.filter(
    (emp) => emp.id !== parseInt(req.body.id)
  );
  data.setEmployees([...filteredArray]);
  res.json(data.employees);
};

const getEmployee = (req, res) => {
  const employee = data.employees.find(
    (emp) => emp.id === parseInt(req.params.id)
  );
  if (!employee) {
    return res
      .status(400)
      .json({ message: `Employee ID ${req.params.id} not found` });
  }
  res.json(employee);
};

module.exports = {
  getAllEmployees,
  createNewEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployee,
};
