import React, { useState } from "react";
import { Input, Table, Select, Radio } from "antd";
import { SearchOutlined } from "@ant-design/icons";

const { Search } = Input;
const { Option } = Select;

const TransactionSearch = ({ transactions }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [sortKey, setSortKey] = useState("");

  const columns = [
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Tag",
      dataIndex: "tag",
      key: "tag",
    },
  ];

  const filteredTransactions = transactions.filter((transaction) => {
    const searchMatch = searchTerm
      ? transaction.tag.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    const tagMatch = selectedTag ? transaction.tag === selectedTag : true;
    const typeMatch = typeFilter ? transaction.type === typeFilter : true;

    return searchMatch && tagMatch && typeMatch;
  });

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (sortKey === "date") {
      return new Date(a.date) - new Date(b.date);
    } else if (sortKey === "amount") {
      return a.amount - b.amount;
    } else {
      return 0;
    }
  });

  const dataSource = sortedTransactions.map((transaction, index) => ({
    key: index,
    ...transaction,
  }));

  return (
    <div>
      <Search
        placeholder="Search by tag"
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ width: 200, marginRight: 10 }}
      />
      <Select
        style={{ width: 200, marginRight: 10 }}
        onChange={(value) => setSelectedTag(value)}
        placeholder="Filter by tag"
        allowClear
      >
        <Option value="food">Food</Option>
        <Option value="education">Education</Option>
        <Option value="office">Office</Option>
        {/* Add more tags here */}
      </Select>
      <Radio.Group
        onChange={(e) => setTypeFilter(e.target.value)}
        value={typeFilter}
      >
        <Radio.Button value="">All</Radio.Button>
        <Radio.Button value="income">Income</Radio.Button>
        <Radio.Button value="expense">Expense</Radio.Button>
      </Radio.Group>
      <Radio.Group onChange={(e) => setSortKey(e.target.value)} value={sortKey}>
        <Radio.Button value="">No Sort</Radio.Button>
        <Radio.Button value="date">Sort by Date</Radio.Button>
        <Radio.Button value="amount">Sort by Amount</Radio.Button>
      </Radio.Group>
      <Table columns={columns} dataSource={dataSource} />
    </div>
  );
};

export default TransactionSearch;
