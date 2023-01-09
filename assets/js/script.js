const urlApi = `https://mindicador.cl/api`;
const filterCurrencies = ["dolar", "euro", "uf", "utm"];
const selectWithCurrencies = document.querySelector("#currency");
const divResult = document.querySelector("#result");

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

const getCurrencies = async () => {
	try {
		const req = await fetch(urlApi);
		const resData = await req.json();

		//obtener el codigo de las monedas

		const currencyList = filterCurrencies.map((currency) => {
			return {
				code: resData[currency].codigo,
				value: resData[currency].valor,
			};
		});

		const list = document.querySelector("#currency");

		currencyList.forEach((localCurrency) => {
			const option = document.createElement("option");
			option.value = localCurrency.value;
			option.text = capitalize(localCurrency.code);
			selectWithCurrencies.appendChild(option);
		});
	} catch (error) {
		console.log(error);
		alert("Error al obtener el listado de monedas");
	}
};

const calcResult = (amount, currency) => {
	console.log(`amount: ${amount}, currency: ${currency}`);
	divResult.innerHTML = `$ ${(amount / currency).toFixed(2)} .-`;
};

//dibujar grafico

const drawChart = async (currency) => {
	try {
		const reqChart = await fetch(`${urlApi}/${currency}`);
		const dataChart = await reqChart.json();

		const serieToChart = dataChart.serie.slice(0, 10);
		console.log(serieToChart);

		//Creacion del grafico

		const data = {
			labels: serieToChart.map((item) => item.fecha.substring(0, 10)),
			datasets: [
				{
					label: currency,
					data: serieToChart.map((item) => item.valor),
				},
			],
		};

		const config = {
			type: "line",
			data: data,
		};

		const chartDOM = document.querySelector("#chart");
		chartDOM.innerHTML = "";
		chartDOM.classList.remove("d-none");
		new Chart(chartDOM, config);
	} catch (error) {
		alert("Error al obtener la data para el grafico");
		console.log(error);
	}
};

document.querySelector("#btnConvert").addEventListener("click", () => {
	const amountPesos = document.querySelector("#pesos").value;
	if (amountPesos === "") {
		alert("Debes ingresar una cantidad de pesos");
		return;
	}

	const currencySelected = selectWithCurrencies.value;
	const codeCurrencySelected =
		selectWithCurrencies.options[
			selectWithCurrencies.selectedIndex
		].text.toLowerCase();

	calcResult(amountPesos, currencySelected);
	drawChart(codeCurrencySelected);
});

getCurrencies();
