import React, { useEffect, useState } from "react";
import {
  Card,
  Col,
  Row,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
} from "antd";
import { Line, Pie } from "@ant-design/charts";
import { PlusOutlined } from "@ant-design/icons";
import moment from "moment";
import TransactionSearch from "./TransactionSearch";

const Dashboard = () => {
  const sampleTransactions = [
    { type: "income", date: "2023-01-15", amount: 2000, tag: "salary" },
    { type: "expense", date: "2023-01-20", amount: 500, tag: "food" },
    { type: "expense", date: "2023-01-25", amount: 300, tag: "education" },
    // Add more transactions
  ];
  const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
  const [isIncomeModalVisible, setIsIncomeModalVisible] = useState(false);
  const [transactions, setTransactions] = useState(sampleTransactions);
  const [currentBalance, setCurrentBalance] = useState(0);
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState(0);

  const processChartData = () => {
    const balanceData = [];
    const spendingData = {};

    transactions.forEach((transaction) => {
      const monthYear = moment(transaction.date).format("MMM YYYY");
      const tag = transaction.tag;

      if (transaction.type === "income") {
        if (balanceData.some((data) => data.month === monthYear)) {
          balanceData.find((data) => data.month === monthYear).balance +=
            transaction.amount;
        } else {
          balanceData.push({ month: monthYear, balance: transaction.amount });
        }
      } else {
        if (balanceData.some((data) => data.month === monthYear)) {
          balanceData.find((data) => data.month === monthYear).balance -=
            transaction.amount;
        } else {
          balanceData.push({ month: monthYear, balance: -transaction.amount });
        }

        if (spendingData[tag]) {
          spendingData[tag] += transaction.amount;
        } else {
          spendingData[tag] = transaction.amount;
        }
      }
    });

    const spendingDataArray = Object.keys(spendingData).map((key) => ({
      category: key,
      value: spendingData[key],
    }));

    return { balanceData, spendingDataArray };
  };

  const { balanceData, spendingDataArray } = processChartData();
  const showExpenseModal = () => {
    setIsExpenseModalVisible(true);
  };

  const showIncomeModal = () => {
    setIsIncomeModalVisible(true);
  };

  const handleExpenseCancel = () => {
    setIsExpenseModalVisible(false);
  };

  const handleIncomeCancel = () => {
    setIsIncomeModalVisible(false);
  };

  const onFinish = (values, type) => {
    const newTransaction = {
      type: type,
      date: moment(values.date).format("YYYY-MM-DD"),
      amount: parseFloat(values.amount),
      tag: values.tag,
    };

    setTransactions([...transactions, newTransaction]);
    calculateBalance();
  };

  const calculateBalance = () => {
    let incomeTotal = 0;
    let expensesTotal = 0;

    transactions.forEach((transaction) => {
      if (transaction.type === "income") {
        incomeTotal += transaction.amount;
      } else {
        expensesTotal += transaction.amount;
      }
    });

    setIncome(incomeTotal);
    setExpenses(expensesTotal);
    setCurrentBalance(incomeTotal - expensesTotal);
  };

  // Calculate the initial balance, income, and expenses
  useEffect(() => {
    calculateBalance();
  }, [transactions]);

  const balanceConfig = {
    data: balanceData,
    xField: "month",
    yField: "balance",
  };

  const spendingConfig = {
    data: spendingDataArray,
    angleField: "value",
    colorField: "category",
  };

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>
      <Row gutter={16}>
        <Col span={8}>
          <Card title="Current Balance" bordered={false}>
            ${currentBalance}
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Total Income" bordered={false}>
            ${income}
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Total Expenses" bordered={false}>
            ${expenses}
          </Card>
        </Col>
      </Row>
      <Row gutter={16} style={{ marginTop: "16px" }}>
        <Col span={12}>
          <Card title="Financial Statistics" bordered={false}>
            <Line {...{ ...balanceConfig, data: balanceData }} />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Total Spending" bordered={false}>
            <Pie {...{ ...spendingConfig, data: spendingDataArray }} />
          </Card>
        </Col>
      </Row>

      {/* Add Expense Modal */}
      <Modal
        title="Add Expense"
        visible={isExpenseModalVisible}
        onCancel={handleExpenseCancel}
        footer={null}
      >
        <Form
          layout="vertical"
          onFinish={(values) => onFinish(values, "expense")}
        >
          <Form.Item
            label="Amount"
            name="amount"
            rules={[
              { required: true, message: "Please input the expense amount!" },
            ]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            label="Date"
            name="date"
            rules={[
              { required: true, message: "Please select the expense date!" },
            ]}
          >
            <DatePicker format="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item
            label="Tag"
            name="tag"
            rules={[{ required: true, message: "Please select a tag!" }]}
          >
            <Select>
              <Select.Option value="food">Food</Select.Option>
              <Select.Option value="education">Education</Select.Option>
              <Select.Option value="office">Office</Select.Option>
              {/* Add more tags here */}
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Add Expense
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Add Income Modal */}
      <Modal
        title="Add Income"
        visible={isIncomeModalVisible}
        onCancel={handleIncomeCancel}
        footer={null}
      >
        <Form
          layout="vertical"
          onFinish={(values) => onFinish(values, "income")}
        >
          <Form.Item
            label="Amount"
            name="amount"
            rules={[
              { required: true, message: "Please input the income amount!" },
            ]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            label="Date"
            name="date"
            rules={[
              { required: true, message: "Please select the income date!" },
            ]}
          >
            <DatePicker format="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item
            label="Tag"
            name="tag"
            rules={[{ required: true, message: "Please select a tag!" }]}
          >
            <Select>
              <Select.Option value="salary">Salary</Select.Option>
              <Select.Option value="freelance">Freelance</Select.Option>
              <Select.Option value="investment">Investment</Select.Option>
              {/* Add more tags here */}
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Add Income
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Add Expense and Add Income buttons */}
      <Row gutter={16} style={{ marginTop: "16px" }}>
        <Col span={12}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={showExpenseModal}
          >
            Add Expense
          </Button>
        </Col>
        <Col span={12}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={showIncomeModal}
          >
            Add Income
          </Button>
        </Col>
      </Row>
      <TransactionSearch transactions={transactions} />
    </div>
  );
};

export default Dashboard;
