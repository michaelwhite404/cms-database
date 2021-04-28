import axios from "axios";
import React, { useEffect, useState } from "react";
import {
	BrowserRouter as Router,
	Link,
	Route,
	Switch,
	useHistory,
	useParams,
} from "react-router-dom";
import "./App.css";
import DatabaseModel from "../../src/interfaces/databaseInterface";
import { CollectionModel } from "../../src/interfaces/collectionInterfaces";
import { ItemModel } from "../../src/interfaces/itemInterfaces";

function App() {
	return (
		<Router>
			<div>
				<nav>
					<ul>
						<li>
							<Link to="/">Home</Link>
						</li>
						<li>
							<Link to="/login">Login</Link>
						</li>
						<li>
							<Link to="/dashboard">Dashboard</Link>
						</li>
					</ul>
				</nav>

				<Switch>
					<Route path="/login">
						<Login />
					</Route>
					<Route path="/dashboard">
						<Dashboard />
					</Route>
					<Route path="/databases/:database" component={Database} />
					<Route path="/collections/:collection" component={Collection} />
					<Route path="/">
						<Home />
					</Route>
				</Switch>
			</div>
		</Router>
	);
}

function Home() {
	return <h2>Home</h2>;
}

function Dashboard() {
	const [databases, setDatabases] = useState<DatabaseModel[]>([]);

	async function fetchData() {
		try {
			const res = await axios.get("/api/v1/databases/roles");
			setDatabases(res.data.databases);
			console.log(res.data);
		} catch (err) {
			console.log(err.response.data);
		}
	}

	useEffect(() => {
		fetchData();
	}, []);

	return (
		<>
			<h2>Dashboard</h2>
			<ul>
				{databases.map((database) => (
					<li key={database._id}>
						<div>{database.name}</div>
						<div>{database.createdAt}</div>
						<div>{database.slug}</div>
						<div>{database.role}</div>
						<div>{database._id}</div>
					</li>
				))}
			</ul>
		</>
	);
}

function Login() {
	const [values, setValues] = useState({ email: "", password: "" });
	let history = useHistory();
	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		try {
			const res = await axios.post("/api/v1/users/login", values);
			console.log(res.data);
			history.push("/dashboard");
		} catch (err) {
			console.log(err.response.data);
		}
	};
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setValues({ ...values, [e.target!.name]: e.target!.value });
	};

	return (
		<>
			<h2>Login</h2>
			<form onSubmit={handleSubmit}>
				<label htmlFor="email-address">Email</label>
				<input type="text" name="email" id="email-address" onChange={handleChange} />
				<label htmlFor="password">Password</label>
				<input type="password" name="password" id="password" onChange={handleChange} />
				<button>Login</button>
			</form>
		</>
	);
}

function Database(/* props */) {
	const [collections, setCollections] = useState<CollectionModel[]>([]);

	const params = useParams<{ database: string }>();
	// console.log(props.match.params.database);
	const fetchData = async () => {
		try {
			const res = await axios.get(`/api/v1/databases/${params.database}/collections?slug=true`);
			setCollections(res.data.collections);
		} catch (err) {
			console.log(err.response.data);
		}
	};

	useEffect(() => {
		fetchData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<>
			<h2>Collections</h2>
			{collections.map((collection) => (
				<li key={collection._id}>
					<div>{collection.name}</div>
					<div>{collection.createdAt}</div>
					<div>{collection.slug}</div>
					<div>{collection._id}</div>
				</li>
			))}
		</>
	);
}

function Collection() {
	const [items, setItems] = useState<ItemModel[]>([]);

	const params = useParams<{ collection: string }>();

	const fetchData = async () => {
		try {
			const res = await axios.get(`/api/v1/collections/${params.collection}/items`);
			setItems(res.data.items);
			console.log(res.data);
		} catch (err) {
			console.log(err.response.data);
		}
	};

	useEffect(() => {
		fetchData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<>
			<h2>Collection</h2>
			{items.map((item) => (
				<li key={item._id as string}>
					<div>{item.slug}</div>
					<div>{item["created-on"]}</div>
					<div>{item._id}</div>
				</li>
			))}
		</>
	);
}

export default App;
