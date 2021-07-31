import axios, { AxiosError } from "axios";
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Switch, useParams } from "react-router-dom";
import "./App.css";
import { ItemModel } from "../../src/interfaces/itemInterfaces";
import { APIItemResponse } from "./interfaces/APIResponse";
import AppError from "../../src/utils/appError";
import Login from "./components/Login";
import Project from "./Pages/Project/Project";
import Dashboard from "./Pages/Dashboard/Dashboard";
import { ProjectCollectionsProvider } from "./context/ProjectCollectionsContext";
import { ProjectsProvider } from "./context/ProjectsContext";
import SuccessNotification from "./components/SuccessNotification";
import { SuccessNotificationProvider } from "./context/SuccessNotificationContext";

function App() {
	return (
		<Router>
			<div>
				{/* <nav>
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
				</nav> */}
				<SuccessNotificationProvider>
					<Switch>
						<Route exact path="/login">
							<Login />
						</Route>
						<ProjectsProvider>
							<Route path="/dashboard" exact component={Dashboard} />
							<ProjectCollectionsProvider>
								<Route path="/databases/:database" exact component={Project} />
							</ProjectCollectionsProvider>
							<Route path="/collections/:collection" exact component={Collection} />
						</ProjectsProvider>
						<Route exact path="/">
							<Home />
						</Route>
					</Switch>

					<SuccessNotification />
				</SuccessNotificationProvider>
			</div>
		</Router>
	);
}

function Home() {
	return <h1 className="text-3xl font-bold">Home</h1>;
}

function Collection() {
	const [items, setItems] = useState<ItemModel[]>([]);

	const params = useParams<{ collection: string }>();

	const fetchData = async () => {
		try {
			const res = await axios.get<APIItemResponse>(
				`/api/v1/collections/${params.collection}/items`
			);
			setItems(res.data.items);
			console.log(res.data);
		} catch (err) {
			console.log((err as AxiosError<AppError>).response!.data);
		}
	};

	useEffect(() => {
		fetchData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<>
			<h2 className="text-3xl font-bold">Collection</h2>
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
