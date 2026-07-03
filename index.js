function updateQueuingInputs() {
    const model = document.getElementById("queuing-model").value;

    const commonInputs = document.querySelectorAll(".common-input");

    const distributionSelect = document.getElementById("distribution-select");
    const servers = document.getElementById("numServers");

    const serviceDistributionSelect = document.getElementById("service-distribution-select");

    commonInputs.forEach(input => input.classList.add("hidden"));
    distributionSelect.classList.add("hidden");
    servers.classList.add("hidden");
    serviceDistributionSelect.classList.add("hidden");
    resetInputs();
    resetServiceInputs();


    if (model === "M/M/1" || model === "M/M/2") {

        console.log("Showing common inputs for M/M/1 or M/M/2");
        (console.log(commonInputs))
        commonInputs.forEach(input => input.classList.remove("hidden"));
        document.querySelector(".common-input1").classList.remove("hidden");
        document.querySelector(".common-input2").classList.remove("hidden");

    } else if (model === "M/G/1" || model === "M/G/2") {
        console.log("Showing common inputs and distribution for M/G/1 or M/G/2");
        document.querySelector(".common-input").classList.remove("hidden");
        document.querySelector(".common-input1").classList.remove("hidden");
        document.querySelector(".common-input2").classList.add("hidden");

        serviceDistributionSelect.classList.remove("hidden");
    } else if (model === "G/G/1" || model === "G/G/2") {
        console.log("Showing inputs for G/G/1 or G/G/2");
        document.querySelector(".common-input").classList.remove("hidden");
        document.querySelector(".common-input1").classList.add("hidden");
        document.querySelector(".common-input2").classList.add("hidden");


        distributionSelect.classList.remove("hidden");
        serviceDistributionSelect.classList.remove("hidden");
    }
    if (model === "M/M/2" || model === "M/G/2" || model === "G/G/2") {
        document.querySelector(".common-input3").classList.remove("hidden");

    }

}

function updateDistributionInputs() {
    const type = document.getElementById("distributionType").value;
    resetInputs();

    if (type === "uniform") {
        document.getElementById("uniformInputs").classList.remove("hidden");
    } else if (type === "gamma") {
        document.getElementById("gammaInputs").classList.remove("hidden");
    } else if (type === "normal") {
        document.getElementById("normalInputs").classList.remove("hidden");
    }
    console.log(type)

    return type;
}

function updateServiceDistributionInputs() {
    const type = document.getElementById("serviceDistributionType").value;
    resetServiceInputs();

    if (type === "uniform") {
        document.getElementById("serviceUniformInputs").classList.remove("hidden");
    } else if (type === "gamma") {
        document.getElementById("serviceGammaInputs").classList.remove("hidden");
    } else if (type === "normal") {
        document.getElementById("serviceNormalInputs").classList.remove("hidden");
    }
    console.log(type)
    return type;
}

function resetInputs() {
    document.getElementById("uniformInputs").classList.add("hidden");
    document.getElementById("gammaInputs").classList.add("hidden");
    document.getElementById("normalInputs").classList.add("hidden");
}

function resetServiceInputs() {
    document.getElementById("serviceUniformInputs").classList.add("hidden");
    document.getElementById("serviceGammaInputs").classList.add("hidden");
    document.getElementById("serviceNormalInputs").classList.add("hidden");
}

// Utility function to add "hidden" class to elements
// document.querySelectorAll(".hidden").forEach(el => el.style.display = "none");
document.addEventListener('DOMContentLoaded', function () {
    var numServersInput = document.getElementById('numServers'); // Get the specific input field by its ID

    // Listen for input changes on the numServers input field
    numServersInput.addEventListener('input', function () {
        var servers = parseInt(this.value); // Get the input value as a number

        // If the value is outside the range, clear the input field and show an alert
        if (isNaN(servers) || servers < 2 || servers > 5) {
            alert("Number of servers must be between 2 and 5.");
            this.value = ''; // Clear the input field
        }
    });
});





function fact(num) {
    if (num < 0) {
        return -1;
    }
    else if (num == 0) {
        return 1;
    }
    else {
        let result = 1;
        for (var i = num; i > 1; i--) {
            result *= i;
        };
        return result;
    }
};
function calculatePoissonCP(lambda, maxCustomers) {
    let x_start = 1;
    const x_step = 1;
    let cp = 0;
    let x = 0;
    let cparray = [];
    let cplookuparray = [];

    // Loop to calculate the cumulative probability for Poisson distribution
    while (cp < 1 && x_start <= maxCustomers) {
        const calc = jStat.poisson.pdf(x, lambda); // Calculate the probability mass function
        cp += calc; // Increment cumulative probability
        cparray.push(cp);  // Store the cumulative probability
        cplookuparray.push(cp - calc); // Store the lookup value (previous cp)

        // Increment x for the next iteration
        x += x_step;
        x_start += 1
    }

    return [cparray, cplookuparray];  // Return both the cumulative probability array and the lookup array
}


function calculateNormalCP(mean, stddev, numCustomers) {
    const x_start = mean - 4 * stddev; // Start value for x (4 stddevs below the mean)
    const x_step = 1;                 // Step increment for x
    let cp = 0;                       // Initial cumulative probability
    let x = x_start;                  // Start with x = x_start
    let cparray = [];                 // Array to store the cumulative probabilities
    let cplookuparray = [];           // Array for previous cumulative probabilities

    // Loop to calculate the cumulative probability for Normal distribution
    while (cp < 1 && cparray.length < numCustomers) {
        const pdfValue = jStat.normal.pdf(x, mean, stddev); // Calculate the PDF value at x

        // Probability increment (PDF value times x_step)
        const calc = pdfValue * x_step;

        // Store the current value of cumulative probability (before increment)
        cplookuparray.push(cp);

        // Increment cumulative probability
        cp += calc;

        // Store the updated cumulative probability
        cparray.push(cp);

        // Stop the loop if cumulative probability exceeds or equals 1
        if (cp >= 1) {
            // Adjust the last value of cparray and cplookuparray to exactly 1
            cparray[cparray.length - 1] = 1;
            cplookuparray[cplookuparray.length - 1] = 1 - calc;
            break;
        }

        // Increment x for the next iteration
        x += x_step;
    }

    return [cparray, cplookuparray]; // Return both the cumulative probability array and the lookup array
}

function calculateGammaCP(shape, scale, numCustomers) {
    const x_start = 0;  // Starting value for x
    const x_step = 1;   // Step increment for x
    let cp = 0;         // Initial cumulative probability
    let x = x_start;    // Start with x = 0
    let cparray = [];   // Array to store the cumulative probabilities
    let cplookuparray = []; // Array for previous cp values

    // Loop to calculate cumulative probability for Gamma distribution
    while (cp < 1 && cparray.length < numCustomers) {
        const pdfValue = jStat.gamma.pdf(x, shape, scale); // Calculate the PDF value at x

        // Probability increment (PDF value times x_step)
        const calc = pdfValue * x_step;

        // Increment cumulative probability
        cp += calc;

        // Add the cumulative probability to the cparray
        if (cp > 0 || cparray.length > 0) {
            cparray.push(cp);
            cplookuparray.push(cp - calc); // Add the previous cumulative probability
        }

        // Stop the loop if cumulative probability exceeds or equals 1
        if (cp >= 1) {
            // Adjust the last value of cparray and cplookuparray to exactly 1
            cparray[cparray.length - 1] = 1;
            cplookuparray[cplookuparray.length - 1] = 1 - calc;
            break;
        }

        // Increment x for the next iteration
        x += x_step;
    }

    return [cparray, cplookuparray];
}


function calculateUniformCP(a, b, numCustomers) {
    const x_start = a;     // Starting value for x
    const x_step = 1;      // Step increment for x
    let cp = 0;            // Initial cumulative probability
    let x = x_start;       // Start with x = a
    let cparray = [];      // Array to store the cumulative probabilities
    let cplookuparray = []; // Array for previous cumulative probabilities

    // Loop to calculate the cumulative probability for Uniform distribution
    while (cp < 1 && cparray.length < numCustomers) {
        const pdfValue = jStat.uniform.pdf(x, a, b); // Calculate the PDF value at x

        // Probability increment (PDF value times x_step)
        const calc = pdfValue * x_step;

        // Store the current value of cumulative probability (before increment)
        cplookuparray.push(cp);

        // Increment cumulative probability
        cp += calc;

        // Store the updated cumulative probability
        cparray.push(cp);

        // Stop the loop if cumulative probability exceeds or equals 1
        if (cp >= 1) {
            // Adjust the last value of cparray and cplookuparray to exactly 1
            cparray[cparray.length - 1] = 1;
            cplookuparray[cplookuparray.length - 1] = 1 - calc;
            break;
        }

        // Increment x for the next iteration
        x += x_step;
    }

    return [cparray, cplookuparray]; // Return both the cumulative probability array and the lookup array
}


function Addvalues() {
    var queuingModel = document.getElementById("queuing-model").value;
    var serviceMinInput = document.getElementById('service_min');
    var serviceMaxInput = document.getElementById('service_max');
    var serviceMean = document.getElementById('service-mean');
    var meanArrival = document.getElementById("mean-arrival");
    var avgInterarrival = document.getElementById('avg_interarrival');
    var avgService = document.getElementById('avg_service');
    var varArrival = document.getElementById('var_arrival');
    var varService = document.getElementById('var_service');

    // Hide all elements by default
    serviceMinInput.style.display = "none";
    serviceMaxInput.style.display = "none";
    serviceMean.style.display = "none";
    meanArrival.style.display = "none";
    avgInterarrival.style.display = "none";
    avgService.style.display = "none";
    varArrival.style.display = "none";
    varService.style.display = "none";

    if (queuingModel === "M/G/1" || queuingModel === "M/G/2") {
        serviceMinInput.style.display = "block";
        serviceMaxInput.style.display = "block";
        meanArrival.style.display = "block";
    }

    if (queuingModel === "M/M/2" || queuingModel === "M/M/1") {
        serviceMean.style.display = "block";
        meanArrival.style.display = "block";
    }

    if (queuingModel === "G/G/1" || queuingModel === "G/G/2") {
        avgInterarrival.style.display = "block";
        avgService.style.display = "block";
        varArrival.style.display = "block";
        varService.style.display = "block";
    }
}


// -------------------------------------- M / M / 1 MODEL  ---------------------------------------------- // 
function generate_MM1_Table() {
    let numCustomers = parseInt(document.getElementById("numCustomers").value);
    var arrivalMean = parseFloat(document.getElementById("mean-arrival").value);
    var queuingModel = document.getElementById("queuing-model").value;
    var serviceMean = parseFloat(document.getElementById("service-mean").value);

    if (isNaN(numCustomers) || isNaN(arrivalMean) || isNaN(serviceMean)) {
        alert("Please enter valid values for number of customers, arrival mean, and service mean.");
        return; // Stop further execution if validation fails
    }

    let interarrival = []

    let arraymain = calculatePoissonCP(arrivalMean, numCustomers)
    console.log(arraymain)
    cparray = arraymain[0]
    cplookuparray = arraymain[1]
    // For calculating the inter arrival time 
    interarrival[0] = 0
    for (let i = 1; i < cparray.length; i++) {
        let random = Math.random();

        // Handle the case where random is exactly 0
        if (random === 0) {
            random += 0.1; // Adjust random if it's zero
        } else {
            let found = false;

            // Loop through cplookuparray and cparray to find the correct interarrival time
            for (let j = 0; j < cplookuparray.length; j++) {
                if (random > cplookuparray[j] && random < cparray[j]) {
                    interarrival[i] = j + 1;
                    found = true; // Mark that we've found the value
                    break; // Exit loop once we find the correct value
                }
            }

            // Additional condition if no match is found in the above loop
            if (!found) {
                interarrival[i] = Math.floor(Math.random() * cparray.length); // Assign a random integer from 0 to cparray.length - 1
            }
        }
    }

    let currentTime = 0;
    let arrivalarray = [];
    let servicearray = [];
    let starttime = [];
    let endtime = []
    // let turnaround = [];
    // let waittime = [];
    let service = 0;
    // For calculating the Arrival time and Service Time.
    for (let i = 0; i < cparray.length; i++) {
        currentTime = currentTime + interarrival[i]
        arrivalarray[i] = currentTime;
        service = exponentialRandom(serviceMean);
        if (Math.floor(service) == 0) {
            servicearray[i] = Math.ceil(service);
        }
        else {
            servicearray[i] = roundOff(service)
        }
    }

    let Ganttchart = [];  // Initialize an empty array to store Gantt chart data
    let check = 0;        // Variable to track the current time in the system (i.e., when the server is idle or serving a customer)
    let index = 0;        // Index to track the current customer being processed
    let customerData = [];  // Array to store customer data for output (start time, end time, customer ID)

    // Iterate until all customers are processed
    while (index < cparray.length) {

        // 1. Customer arrives at the current time
        if (arrivalarray[index] === check) {
            Ganttchart.push([check, check + servicearray[index], index + 1]);  // Add customer service data to Ganttchart
            customerData.push([check, check + servicearray[index], index + 1]);  // Add customer data for table output
            starttime[index] = check;
            endtime[index] = check + servicearray[index];
            check += servicearray[index];  // Update time after serving the customer
            index++;  // Move to the next customer
        }

        // 2. Customer arrives after idle time (server is idle)
        else if (arrivalarray[index] > check) {
            Ganttchart.push([check, arrivalarray[index], -1]);  // Add idle time to Ganttchart with ID -1 for visualization
            check = arrivalarray[index];  // Server is idle until the customer arrives
        }

        // 3. Customer arrives before the current time (overlap)
        else {
            Ganttchart.push([check, check + servicearray[index], index + 1]);  // Add customer service data to Ganttchart
            customerData.push([check, check + servicearray[index], index + 1]);  // Add customer data for table output
            starttime[index] = check;
            endtime[index] = check + servicearray[index];
            check += servicearray[index];  // Update time after serving the customer
            index++;  // Move to the next customer
        }
    }

    // Log the Gantt chart with idle time represented
    console.log("Ganttchart (including idle time):", Ganttchart);

    // Log the customer data for table output (without idle time)
    console.log("Customer Data (for table output):", customerData);

    for (let i = 0; i < customerData.length; i++) {
        for (let j = 0; j < 3; j++) {
            console.log(customerData[i] + '\n')

        }

    }
    // console.log(Ganttchart)
    function generateGanttChart(Ganttchart, numCustomers) {
        console.log("ganttchart function is called");
        console.log("Ganttchart Data:", Ganttchart);
        console.log("Number of Customers:", numCustomers);
        const ganttChartContainer = document.getElementById("ganttChart");

        // Clear previous Gantt chart
        ganttChartContainer.innerHTML = "";

        const tooltip = document.createElement("div");
        tooltip.id = "tooltip";
        document.body.appendChild(tooltip);

        // Assign a unique color for each customer (you can change the color scheme here)
        const colors = Array.from({ length: numCustomers }, (_, i) => {
            // Generate dark colors with high saturation and low lightness
            const hue = (i * 360) / numCustomers; // Evenly spaced hues
            const saturation = 70 + Math.random() * 30; // Random saturation between 70% to 100%
            const lightness = 30 + Math.random() * 20; // Dark lightness between 30% to 50%

            const color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
            return color;
        });

        // Loop over Ganttchart to display each customer and idle time
        Ganttchart.forEach(([start, end, customer], index) => {
            console.log(`Index: ${index}, Start: ${start}, End: ${end}, Customer: ${customer}`);
            const section = document.createElement("div");
            section.classList.add("gantt-section");

            // Set width for the section, based on its duration (start to end time)
            const width = ((end - start) / (Ganttchart[Ganttchart.length - 1][1])) * 100;  // Relative width based on total time
            section.style.width = `${width}%`;
            section.style.left = `${(start / (Ganttchart[Ganttchart.length - 1][1])) * 100}%`;  // Position the section based on start time
            // section.style.borderRadius = "6px";
            // Set background color based on customer or idle period
            if (customer === -1) {
                section.style.backgroundColor = "#ccc";  // Idle section color (light gray)
            } else {
                section.style.backgroundColor = colors[customer - 1];  // Customer section color
            }

            // Add hover information for tooltips
            section.addEventListener("mouseover", (event) => {
                tooltip.style.display = "block";
                tooltip.innerHTML = customer === -1
                    ? `Idle: ${start} - ${end}`
                    : `Customer ${customer}<br>Start: ${start}<br>End: ${end}`;
            });
        
            section.addEventListener("mousemove", (event) => {
                const tooltipWidth = tooltip.offsetWidth;
                const tooltipHeight = tooltip.offsetHeight;
                const viewportWidth = window.innerWidth;
                const viewportHeight = window.innerHeight;
        
                let left = event.pageX + 10;
                let top = event.pageY + 10;
        
                if (left + tooltipWidth > viewportWidth) {
                    left = event.pageX - tooltipWidth - 10;
                }
        
                if (top + tooltipHeight > viewportHeight) {
                    top = event.pageY - tooltipHeight - 10;
                }
        
                tooltip.style.left = `${left}px`;
                tooltip.style.top = `${top}px`;
            });
        
            section.addEventListener("mouseleave", () => {
                tooltip.style.display = "none";
            });
        
            ganttChartContainer.appendChild(section);
        });
    }
    // function generateTimeLabels(Ganttchart) {
    //     const timeLabelsContainer = document.getElementById("timeLabels");
    //     timeLabelsContainer.innerHTML = "";  // Clear previous labels

    //     const totalTime = Ganttchart[Ganttchart.length - 1][1];  // Get the total end time

    //     // Create time labels at intervals (e.g., every 10 units of time)
    //     for (let i = 0; i <= totalTime; i += 10) {
    //         const label = document.createElement("div");
    //         label.classList.add("time-label");
    //         label.innerHTML = i;
    //         label.style.left = `${(i / totalTime) * 100}%`;  // Position the label according to the time
    //         timeLabelsContainer.appendChild(label);
    //     }
    // }

    // console.log("Ganttchart before calling generateGanttChart:", Ganttchart);
    generateGanttChart(Ganttchart, numCustomers);
    // generateTimeLabels(Ganttchart);
    const table = document.getElementById("simulation_table");
    let previousEndTime = 0;

    // Clear previous table rows
    while (table.rows.length > 1) {
        table.deleteRow(1);
    }

    const turnaround = [];
    const waittime = [];
    const restime = [];

    // Table for displaying results
    // const table = document.getElementById("simulation_table");

    // Calculate metrics for each customer
    for (let i = 0; i < customerData.length; i++) {
        const [startTime, endTime, customerId] = customerData[i];
        const arrivalTime = arrivalarray[customerId - 1]; // Arrival time for the specific customer
        const serviceTime = servicearray[customerId - 1]; // Service time for the specific customer
        const cpLookup = cplookuparray[customerId - 1]; // Cp Lookup for the specific customer
        const cp = cparray[customerId - 1]; // Cp for the specific customer
        const interArrival = interarrival[customerId - 1]; // Inter Arrival time
        const avgArrival = i; // Average time between arrivals (serial number here)

        // Calculate metrics
        const turnaroundTime = endTime - arrivalTime; // Turnaround time = End time - Arrival time
        const waitTime = turnaroundTime - serviceTime; // Wait time = Turnaround time - Service time
        const responseTime = startTime - arrivalTime; // Response time = Start time - Arrival time

        // Store the results
        turnaround.push(turnaroundTime);
        waittime.push(waitTime);
        restime.push(responseTime);


        // Insert a new row into the table
        const row = table.insertRow();
        row.insertCell(0).innerText = i + 1; // Serial Number
        row.insertCell(1).innerText = cpLookup; // Cp Lookup
        row.insertCell(2).innerText = cp; // Cp
        row.insertCell(3).innerText = avgArrival; // Avg Time Between Arrival
        row.insertCell(4).innerText = interArrival; // Inter Arrival
        row.insertCell(5).innerText = roundOff(arrivalTime); // Arrival Time
        row.insertCell(6).innerText = roundOff(serviceTime); // Service Time
        row.insertCell(7).innerText = roundOff(startTime); // Start Time
        row.insertCell(8).innerText = roundOff(endTime); // End Time
        row.insertCell(9).innerText = roundOff(turnaroundTime); // Turnaround Time
        row.insertCell(10).innerText = roundOff(waitTime); // Wait Time
        row.insertCell(11).innerText = roundOff(responseTime); // Response Time
        row.insertCell(12).innerText = "Server 1"; // Server

        // Log metrics for debugging
        console.log(
            `Customer ${customerId}: Turnaround = ${turnaroundTime}, Wait = ${waitTime},cp = ${cp},cplookup = ${cplookuparray}, Response = ${responseTime}`
        );
    }

    // Calculate server utilization and averages
    let totalServiceTime = 0;
    let totalIdleTime = 0;

    // Iterate over Gantt chart for server time calculations
    Ganttchart.forEach(([start, end, customer]) => {
        if (customer === -1) {
            totalIdleTime += end - start; // Idle time when no customer is served
        } else {
            totalServiceTime += end - start; // Service time for customers
        }
    });

    // Calculate total metrics
    const totalWaitTime = waittime.reduce((sum, wt) => sum + wt, 0);
    const totalTurnaroundTime = turnaround.reduce((sum, tat) => sum + tat, 0);
    const totalResponseTime = restime.reduce((sum, rt) => sum + rt, 0);
    const avgResponseTime = totalResponseTime / restime.length;

    // Compute averages
    const avgWaitTime = totalWaitTime / customerData.length;
    const avgTurnaroundTime = totalTurnaroundTime / customerData.length;

    // Compute server utilization
    const totalTime = totalServiceTime;
    const serverUtilization = (totalServiceTime / totalTime) * 100;

    // Log final results
    console.log("Average Wait Time:", avgWaitTime.toFixed(2));
    console.log("Average Turnaround Time:", avgTurnaroundTime.toFixed(2));
    console.log("Server Utilization:", serverUtilization.toFixed(2), "%");
    const serverUtil = document.getElementById("server-utilization");
    const avgTA = document.getElementById("avg-turnaround");
    const avgWT = document.getElementById("avg-wait");
    const avgRT = document.getElementById("avg-response");
    serverUtil.innerHTML = serverUtilization.toFixed(2) + "%";  // Add the percentage sign here
    avgTA.innerHTML = avgTurnaroundTime.toFixed(4);
    avgWT.innerHTML = avgWaitTime.toFixed(4);
    avgRT.innerHTML = avgResponseTime.toFixed(4);;


    // Function to round off values for consistent display


    function exponentialRandom(mean) {
        return -Math.log(1 - Math.random()) * mean;
    }

    function roundOff(value) {
        return Math.round(value);
    }

    renderArrivalLineGraph("arrivalLineGraph", interarrival)
    renderWaitTimeBarGraph(waittime, "waitTimeBarGraph")
    renderResponseTimeBarGraph(restime, "responseTimeBarGraph")
    renderTurnaroundTimeBarGraph(turnaround, "turnaroundTimeBarGraph")



}

// ------------------------------------ M / M / 2 MODEL  ---------------------------------------------- //

function mmc(numberOfServers, arrivalarray, servicearray) {
    if (numberOfServers < 2 || numberOfServers > 5) {
        throw new Error("Number of servers must be between 2 and 5.");
    }

    let ganttCharts = Array.from({ length: numberOfServers }, () => []);
    let serverAvailability = Array(numberOfServers).fill(0); // Track availability times for each server
    let serverStates = Array(numberOfServers).fill("idle"); // Track states of each server
    let customerData = [];
    let startTimes = [];
    let endTimes = [];  // Array to store end times

    for (let i = 0; i < arrivalarray.length; i++) {
        let availableServer = serverAvailability.findIndex((time) => time <= arrivalarray[i]);

        if (availableServer === -1) {
            availableServer = serverAvailability.indexOf(Math.min(...serverAvailability));
        }

        const serverStart = Math.max(serverAvailability[availableServer], arrivalarray[i]);
        const serviceTime = servicearray[i];
        const endTime = serverStart + serviceTime;

        if (serverAvailability[availableServer] < arrivalarray[i]) {
            ganttCharts[availableServer].push([serverAvailability[availableServer], arrivalarray[i], -1, availableServer + 1]);
        }

        ganttCharts[availableServer].push([serverStart, endTime, i + 1, availableServer + 1]);
        customerData.push({ customer: i + 1, server: availableServer + 1, start: serverStart, end: endTime });

        startTimes.push(serverStart);
        endTimes.push(endTime)

        serverAvailability[availableServer] = endTime;
        serverStates[availableServer] = "busy";

        for (let j = 0; j < numberOfServers; j++) {
            if (serverAvailability[j] <= serverStart) {
                serverStates[j] = "idle";
            }
        }
    }

    const totalTime = Math.max(...serverAvailability);
    const utilization = ganttCharts.map((chart, index) => {
        const busyTime = chart.reduce((sum, entry) => (entry[2] !== -1 ? sum + (entry[1] - entry[0]) : sum), 0);
        return (busyTime / totalTime) * 100;
    });
    console.log(ganttCharts)
    return { ganttCharts, customerData, utilization, startTimes, endTimes };

}

function generate_MM2_Table() {
    let numCustomers = parseInt(document.getElementById("numCustomers").value);
    let arrivalMean = parseFloat(document.getElementById("mean-arrival").value);
    const numberOfServers = parseInt(document.getElementById("numServers").value, 10);
    let queuingModel = document.getElementById("queuing-model").value;
    let serviceMean = parseFloat(document.getElementById("service-mean").value);
    // console.log("ghcghcc", numberOfServers);
    if (isNaN(numCustomers) || isNaN(arrivalMean) || isNaN(serviceMean) || isNaN(numberOfServers)) {
        alert("Please enter valid values for number of customers, arrival mean, service mean, and number of servers.");
        return; // Stop further execution if validation fails
    }
    let interarrival = [];

    let arraymain = calculatePoissonCP(arrivalMean, numCustomers);
    console.log(arraymain);
    cparray = arraymain[0];
    cplookuparray = arraymain[1];

    // For calculating the inter-arrival times
    interarrival[0] = 0
    for (let i = 1; i < cparray.length; i++) {
        let random = Math.random();

        // Handle the case where random is exactly 0
        if (random === 0) {
            random += 0.1; // Adjust random if it's zero
        } else {
            let found = false;

            // Loop through cplookuparray and cparray to find the correct interarrival time
            for (let j = 0; j < cplookuparray.length; j++) {
                if (random > cplookuparray[j] && random < cparray[j]) {
                    interarrival[i] = j + 1;
                    found = true; // Mark that we've found the value
                    break; // Exit loop once we find the correct value
                }
            }

            // Additional condition if no match is found in the above loop
            if (!found) {
                interarrival[i] = Math.floor(Math.random() * cparray.length); // Assign a random integer from 0 to cparray.length - 1
            }
        }
    }

    let currentTime = 0;
    let arrivalarray = [];
    let servicearray = [];
    // let starttime = [];
    // let endtime = [];
    let service = 0;


    // For calculating Arrival time and Service Time
    for (let i = 0; i < cparray.length; i++) {
        currentTime = currentTime + interarrival[i];
        arrivalarray[i] = currentTime;
        service = exponentialRandom(serviceMean);
        servicearray[i] = Math.ceil(service);
    }
    console.log(arrivalarray)
    console.log(servicearray)
    const result = mmc(numberOfServers, arrivalarray, servicearray);

    console.log(result);
    const ganttCharts = result.ganttCharts;
    const customerData = result.customerData;
    const utilizations = result.utilization;
    console.log(utilizations)

    function generateGanttChart(Ganttchart, serverNumber) {
        const ganttChartContainer = document.getElementById(`ganttChartServer${serverNumber}`);
        ganttChartContainer.innerHTML = ""; // Clear any existing content

        // Create a tooltip element
        const tooltip = document.createElement("div");
        tooltip.id = "tooltip";
        document.body.appendChild(tooltip);

        // Validate the Ganttchart array
        if (!Ganttchart || Ganttchart.length === 0) {
            console.warn("Ganttchart is empty. Marking entire timeline as idle.");
            renderGanttSection(0, 100, -1, 100); // Total timeline is idle (dummy totalTime = 100).
            return;
        }

        // Calculate the total timeline length
        const totalTime = Ganttchart[Ganttchart.length - 1]?.[1] || 0;

        const colors = Array.from({ length: numCustomers }, (_, i) => {
            const hue = (i * 360) / numCustomers;
            const saturation = 70 + Math.random() * 30;
            const lightness = 30 + Math.random() * 20;
            return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
        });

        let previousIdleStart = null;
        let previousIdleEnd = null;

        Ganttchart.forEach(([start, end, customer, server], index) => {
            if (typeof start === "undefined" || typeof end === "undefined") {
                console.error(`Malformed Ganttchart entry at index ${index}:`, Ganttchart[index]);
                return;
            }

            if (server === serverNumber) {
                if (customer === -1) {
                    if (previousIdleStart === null) {
                        previousIdleStart = start;
                        previousIdleEnd = end;
                    } else if (previousIdleEnd === start) {
                        previousIdleEnd = end;
                    } else {
                        renderGanttSection(previousIdleStart, previousIdleEnd, -1, totalTime);
                        previousIdleStart = start;
                        previousIdleEnd = end;
                    }
                } else {
                    if (previousIdleStart !== null) {
                        renderGanttSection(previousIdleStart, previousIdleEnd, -1, totalTime);
                        previousIdleStart = null;
                        previousIdleEnd = null;
                    }
                    renderGanttSection(start, end, customer, totalTime);
                }
            }
        });

        if (previousIdleStart !== null) {
            renderGanttSection(previousIdleStart, previousIdleEnd, -1, totalTime);
        }

        function renderGanttSection(start, end, customer, totalTime) {
            const section = document.createElement("div");
            section.classList.add("gantt-section");
            const width = totalTime > 0 ? ((end - start) / totalTime) * 100 : 100;
            section.style.width = `${width}%`;
            section.style.left = `${(start / totalTime) * 100}%`;
            section.style.backgroundColor = customer === -1 ? "#ccc" : colors[customer - 1];

            section.addEventListener("mouseover", (event) => {
                tooltip.style.display = "block";
                tooltip.innerHTML = customer === -1
                    ? `Idle: ${start} - ${end}`
                    : `Customer ${customer}<br>Start: ${start}<br>End: ${end}`;
            });
        
            section.addEventListener("mousemove", (event) => {
                const tooltipWidth = tooltip.offsetWidth;
                const tooltipHeight = tooltip.offsetHeight;
                const viewportWidth = window.innerWidth;
                const viewportHeight = window.innerHeight;
        
                let left = event.pageX + 10;
                let top = event.pageY + 10;
        
                if (left + tooltipWidth > viewportWidth) {
                    left = event.pageX - tooltipWidth - 10;
                }
        
                if (top + tooltipHeight > viewportHeight) {
                    top = event.pageY - tooltipHeight - 10;
                }
        
                tooltip.style.left = `${left}px`;
                tooltip.style.top = `${top}px`;
            });
        
            section.addEventListener("mouseleave", () => {
                tooltip.style.display = "none";
            });
        
            ganttChartContainer.appendChild(section);
        }
    }


    // function generateTimeLabels(Ganttchart) {
    //     const timeLabelsContainer = document.getElementById("timeLabels");
    //     timeLabelsContainer.innerHTML = "";
    //     const totalTime = Ganttchart[Ganttchart.length - 1][1];

    //     for (let i = 0; i <= totalTime; i += 10) {
    //         const label = document.createElement("div");
    //         label.classList.add("time-label");
    //         label.innerHTML = i;
    //         label.style.left = `${(i / totalTime) * 100}%`;
    //         timeLabelsContainer.appendChild(label);
    //     }
    // }

    // generateGanttChart(GanttchartServer1, 1);
    // generateGanttChart(GanttchartServer2, 2);
    // generateTimeLabels(GanttchartServer1);

    const table = document.getElementById("simulation_table");
    while (table.rows.length > 1) {
        table.deleteRow(1);
    }

    const turnaround = [];
    const waittime = [];
    const restime = [];

    for (let i = 0; i < customerData.length; i++) {
        console.log(`Processing customer ${i + 1}`); // Debug log for loop iteration

        const { customer: customerId, server, start, end } = customerData[i];
        console.log(`Customer Data:`, { customerId, server, start, end }); // Log customer data

        const arrivalTime = arrivalarray[customerId - 1];
        const serviceTime = servicearray[customerId - 1];
        const cpLookup = cplookuparray[customerId - 1];
        const cp = cparray[customerId - 1];
        const interArrival = interarrival[customerId - 1];
        const avgArrival = i;

        console.log(`Arrival Time: ${arrivalTime}, Service Time: ${serviceTime}, Cp Lookup: ${cpLookup}, Cp: ${cp}`);
        console.log(`Inter Arrival: ${interArrival}, Avg Arrival: ${avgArrival}`);

        const turnaroundTime = end - arrivalTime;
        const waitTime = turnaroundTime - serviceTime;
        const responseTime = start - arrivalTime;

        console.log(`Calculated Metrics - Turnaround Time: ${turnaroundTime}, Wait Time: ${waitTime}, Response Time: ${responseTime}`);

        turnaround.push(turnaroundTime);
        waittime.push(waitTime);
        restime.push(responseTime);

        const row = table.insertRow();
        console.log(`Inserted new row into the table.`);

        row.insertCell(0).innerText = i + 1; // Serial Number
        row.insertCell(1).innerText = cpLookup; // Cp Lookup
        row.insertCell(2).innerText = cp; // Cp
        row.insertCell(3).innerText = avgArrival; // Avg Time Between Arrival
        row.insertCell(4).innerText = interArrival; // Inter Arrival
        row.insertCell(5).innerText = roundOff(arrivalTime); // Arrival Time
        row.insertCell(6).innerText = roundOff(serviceTime); // Service Time
        row.insertCell(7).innerText = roundOff(start); // Start Time
        row.insertCell(8).innerText = roundOff(end); // End Time
        row.insertCell(9).innerText = roundOff(turnaroundTime); // Turnaround Time
        row.insertCell(10).innerText = roundOff(waitTime); // Wait Time
        row.insertCell(11).innerText = roundOff(responseTime); // Response Time
        row.insertCell(12).innerText =
            server === 1 ? "Server 1" :
                server === 2 ? "Server 2" :
                    server === 3 ? "Server 3" :
                        server === 4 ? "Server 4" :
                            "Server 5";

        console.log(`Row for customer ${i + 1} added with Server ${server}.`);
    }
    function displayGanttCharts(numberOfServers) {
        // Loop through the possible server elements
        for (let i = 1; i <= 5; i++) {
            const titleElement = document.getElementById(`server${i}Title`);
            const chartElement = document.getElementById(`ganttChartServer${i}`);

            if (i <= numberOfServers) {
                // Remove the 'hidden' class for the required servers
                titleElement.classList.remove("hidden");
                chartElement.classList.remove("hidden");
            } else {
                // Ensure other servers remain hidden
                titleElement.classList.add("hidden");
                chartElement.classList.add("hidden");
            }
        }

        // Show the container if at least one server is active
        const container = document.getElementById("mm2GanttChart");
        if (numberOfServers > 0) {
            container.classList.remove("hidden");
        } else {
            container.classList.add("hidden");
        }
    }

    // Example usage: Call the function with the number of servers entered

    displayGanttCharts(numberOfServers);

    // Loop through the number of servers
    for (let serverIndex = 0; serverIndex < numberOfServers; serverIndex++) {
        console.log(`Processing Gantt chart for Server ${serverIndex + 1}`);

        // Extract the Gantt chart data for the current server
        const currentGanttChart = ganttCharts[serverIndex];

        console.log(`Gantt chart data for Server ${serverIndex + 1}:`, currentGanttChart);

        // Call the generateGanttChart function with the extracted data
        generateGanttChart(currentGanttChart, serverIndex + 1);
    }

    const totalWaitTime = waittime.reduce((sum, wt) => sum + wt, 0);
    const totalTurnaroundTime = turnaround.reduce((sum, tat) => sum + tat, 0);
    const totalResponseTime = restime.reduce((sum, rt) => sum + rt, 0);

    const avgWaitTime = totalWaitTime / customerData.length;
    const avgTurnaroundTime = totalTurnaroundTime / customerData.length;
    const avgResponseTime = totalResponseTime / restime.length;

    function updateUtilization(numberOfServers, utilizations) {
        // Get the Utilization Container
        const utilizationContainer = document.getElementById("mm2Utilization");

        // Show the container
        utilizationContainer.classList.remove("hidden");

        // Loop through the server utilization elements
        for (let i = 1; i <= 5; i++) {
            const utilizationElement = document.getElementById(`server${i}-utilization`);
            const utilizationLabel = utilizationElement.previousElementSibling;

            if (i <= numberOfServers) {
                // Show and set utilization value for active servers
                utilizationElement.classList.remove("hidden");
                utilizationLabel.classList.remove("hidden");

                // Set utilization value with 2 decimal places and a percent sign
                const utilizationValue = utilizations[i - 1];
                utilizationElement.innerText =
                    utilizationValue !== undefined
                        ? `${utilizationValue.toFixed(2)}%`
                        : "N/A"; // Display "N/A" if undefined
            } else {
                // Hide elements for inactive servers
                utilizationElement.classList.add("hidden");
                utilizationLabel.classList.add("hidden");
                utilizationElement.innerText = ""; // Clear the text
            }
        }
    }



    updateUtilization(numberOfServers, utilizations);


    const serverUtil1 = document.getElementById("server1-utilization");
    const serverUtil2 = document.getElementById("server2-utilization");
    const avgTA = document.getElementById("avg-turnaround");
    const avgWT = document.getElementById("avg-wait");
    const avgRT = document.getElementById("avg-response");

    // serverUtil1.innerHTML = serverUtilization1.toFixed(2) + "%";
    // serverUtil2.innerHTML = serverUtilization2.toFixed(2) + "%";
    avgTA.innerHTML = avgTurnaroundTime.toFixed(2);
    avgWT.innerHTML = avgWaitTime.toFixed(2);
    avgRT.innerHTML = avgResponseTime.toFixed(2);

    function exponentialRandom(mean) {
        return -Math.log(1 - Math.random()) * mean;
    }

    function roundOff(value) {
        return Math.round(value);
    }
    renderArrivalLineGraph("arrivalLineGraph", interarrival)
    renderWaitTimeBarGraph(waittime, "waitTimeBarGraph")
    renderResponseTimeBarGraph(restime, "responseTimeBarGraph")
    renderTurnaroundTimeBarGraph(turnaround, "turnaroundTimeBarGraph")



}

// ----------------------------------------- M / G / 1 MODEL  ---------------------------------------------- //
function uniformRandom(min, max) {
    x = (max - min);
    y = x * Math.random();
    return min + y
}
function gammaRandom(beta) {
    return -beta * Math.log(Math.random());
}
function normalRandom(mean, sd) {
    // Generate two random values between 0 and 1
    let random1 = Math.random();  // Changed to 'let'
    let random2 = Math.random();  // Changed to 'let'

    // Ensure random2 is not too small to avoid issues with log (it should be between 0 and 1)
    while (random2 < 0.0001) {
        random2 = Math.random(); // Regenerate random2 if it's too small
    }

    // Box-Muller transform to generate a normal distribution
    const logTerm = Math.log(random2);
    const z = Math.cos(2 * Math.PI * random1) * Math.sqrt(-2 * logTerm);

    // Calculate the normal random service time using mean and standard deviation
    let x = mean + sd * z;

    // Retry mechanism: Ensure the value is not NaN or too small
    let retries = 0;
    const maxRetries = 5; // Limit the number of retries

    while ((isNaN(x) || x < 0) && retries < maxRetries) {
        console.warn(`Invalid service time generated: ${x}. Retrying...`);
        random1 = Math.random();  // Reassign 'random1' here
        random2 = Math.random();  // Reassign 'random2' here

        // Regenerate random2 if it's too small
        while (random2 < 0.0001) {
            random2 = Math.random();
        }

        // Recalculate the service time
        const logTerm = Math.log(random2);
        const z = Math.cos(2 * Math.PI * random1) * Math.sqrt(-2 * logTerm);
        x = mean + sd * z;

        retries++;
    }

    // If still invalid after retries, fallback to a reasonable value
    if (isNaN(x) || x < 0) {
        console.warn(`Max retries reached. Falling back to mean value: ${mean}`);
        x = Math.max(1, mean); // Ensure it falls within a reasonable positive range
    }

    // Log generated value for debugging
    console.log(`Generated Normal Service Time: ${x}`);

    return x;
}


function generate_MG1_Table() {

    let params = {};
    const arrivalMean = parseFloat(document.getElementById('mean-arrival').value);
    let numCustomers = parseInt(document.getElementById("numCustomers").value);

    const type = document.getElementById("serviceDistributionType").value;

    // const serviceMin = parseFloat(document.getElementById('service_min').value);
    // const serviceMax = parseFloat(document.getElementById('service_max').value);
    if (type === "uniform") {
        params.minvalue = document.getElementById("serviceUniformMin").value;
        params.maxvalue = document.getElementById("serviceUniformMax").value;
    } else if (type === "gamma") {
        params.mean = document.getElementById("serviceGammaAlpha").value;
        params.shape = document.getElementById("serviceGammaAlpha").value;
    } else if (type === "normal") {
        params.mean = document.getElementById("serviceNormalMean").value;
        params.sd = document.getElementById("serviceNormalSD").value;
    }
    console.log(params)
    // For The Cummulative Probablity 
    let interarrival = [];
    let arraymain = calculatePoissonCP(arrivalMean, numCustomers);
    console.log(arraymain);
    cparray = arraymain[0]
    cplookuparray = arraymain[1]
    // For calculating the inter arrival time 

    interarrival[0] = 0
    for (let i = 1; i < cparray.length; i++) {
        let random = Math.random();

        // Handle the case where random is exactly 0
        if (random === 0) {
            random += 0.1; // Adjust random if it's zero
        } else {
            let found = false;

            // Loop through cplookuparray and cparray to find the correct interarrival time
            for (let j = 0; j < cplookuparray.length; j++) {
                if (random > cplookuparray[j] && random < cparray[j]) {
                    interarrival[i] = j + 1;
                    found = true; // Mark that we've found the value
                    break; // Exit loop once we find the correct value
                }
            }

            // Additional condition if no match is found in the above loop
            if (!found) {
                interarrival[i] = Math.floor(Math.random() * cparray.length); // Assign a random integer from 0 to cparray.length - 1
            }
        }
    }


    let currentTime = 0;
    let arrivalarray = [];
    let servicearray = [];
    let starttime = [];
    let endtime = []
    // let turnaround = [];
    // let waittime = [];
    let service = 0;
    // For calculating the Arrival time and Service Time.
    for (let i = 0; i < cparray.length; i++) {
        currentTime = currentTime + interarrival[i];
        arrivalarray[i] = currentTime;

        // Dynamically determine which random function to call
        if (type === "uniform") {
            service = uniformRandom(params.minvalue, params.maxvalue);
        } else if (type === "gamma") {
            service = gammaRandom(params.shape); // `shape` is beta for gammaRandom
        } else if (type === "normal") {
            console.log(`Mean: ${params.mean}, SD: ${params.sd}`); // Log the values
            service = normalRandom(params.mean, params.sd);
            console.log(`Generated Normal Random Service Time: ${service}`);
        }

        // Apply condition for the service value
        console.log(`Service before threshold check: ${service}`); // Log before threshold check
        if (Math.floor(service) == 0) {
            servicearray[i] = Math.ceil(service);
        } else {
            servicearray[i] = roundOff(service);
        }
        console.log(`Final service time for iteration ${i}: ${servicearray[i]}`); // Log final service time
    }




    console.log(servicearray)
    console.log(interarrival)
    let Ganttchart = [];  // Initialize an empty array to store Gantt chart data
    let check = 0;        // Variable to track the current time in the system (i.e., when the server is idle or serving a customer)
    let index = 0;        // Index to track the current customer being processed
    let customerData = [];  // Array to store customer data for output (start time, end time, customer ID)

    // Iterate until all customers are processed
    while (index < cparray.length) {

        // 1. Customer arrives at the current time
        if (arrivalarray[index] === check) {
            Ganttchart.push([check, check + servicearray[index], index + 1]);  // Add customer service data to Ganttchart
            customerData.push([check, check + servicearray[index], index + 1]);  // Add customer data for table output
            starttime[index] = check;
            endtime[index] = check + servicearray[index];
            check += servicearray[index];  // Update time after serving the customer
            index++;  // Move to the next customer
        }

        // 2. Customer arrives after idle time (server is idle)
        else if (arrivalarray[index] > check) {
            Ganttchart.push([check, arrivalarray[index], -1]);  // Add idle time to Ganttchart with ID -1 for visualization
            check = arrivalarray[index];  // Server is idle until the customer arrives
        }

        // 3. Customer arrives before the current time (overlap)
        else {
            Ganttchart.push([check, check + servicearray[index], index + 1]);  // Add customer service data to Ganttchart
            customerData.push([check, check + servicearray[index], index + 1]);  // Add customer data for table output
            starttime[index] = check;
            endtime[index] = check + servicearray[index];
            check += servicearray[index];  // Update time after serving the customer
            index++;  // Move to the next customer
        }
    }

    // Log the Gantt chart with idle time represented
    console.log("Ganttchart (including idle time):", Ganttchart);

    // Log the customer data for table output (without idle time)
    console.log("Customer Data (for table output):", customerData);

    for (let i = 0; i < customerData.length; i++) {
        for (let j = 0; j < 3; j++) {
            console.log(customerData[i] + '\n')

        }

    }
    // console.log(Ganttchart)
    function generateGanttChart(Ganttchart, numCustomers) {
        console.log("ganttchart function is called");
        console.log("Ganttchart Data:", Ganttchart);
        console.log("Number of Customers:", numCustomers);
        const ganttChartContainer = document.getElementById("ganttChart");

        // Clear previous Gantt chart
        ganttChartContainer.innerHTML = "";

        const tooltip = document.createElement("div");
        tooltip.id = "tooltip";
        document.body.appendChild(tooltip);

        // Assign a unique color for each customer (you can change the color scheme here)
        const colors = Array.from({ length: numCustomers }, (_, i) => {
            // Generate dark colors with high saturation and low lightness
            const hue = (i * 360) / numCustomers; // Evenly spaced hues
            const saturation = 70 + Math.random() * 30; // Random saturation between 70% to 100%
            const lightness = 30 + Math.random() * 20; // Dark lightness between 30% to 50%

            const color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
            return color;
        });

        // Loop over Ganttchart to display each customer and idle time
        Ganttchart.forEach(([start, end, customer], index) => {
            console.log(`Index: ${index}, Start: ${start}, End: ${end}, Customer: ${customer}`);
            const section = document.createElement("div");
            section.classList.add("gantt-section");

            // Set width for the section, based on its duration (start to end time)
            const width = ((end - start) / (Ganttchart[Ganttchart.length - 1][1])) * 100;  // Relative width based on total time
            section.style.width = `${width}%`;
            section.style.left = `${(start / (Ganttchart[Ganttchart.length - 1][1])) * 100}%`;  // Position the section based on start time
            // section.style.borderRadius = "6px";
            // Set background color based on customer or idle period
            if (customer === -1) {
                section.style.backgroundColor = "#ccc";  // Idle section color (light gray)
            } else {
                section.style.backgroundColor = colors[customer - 1];  // Customer section color
            }

            // Add hover information for tooltips
            section.addEventListener("mouseover", (event) => {
                tooltip.style.display = "block";
                tooltip.innerHTML = customer === -1
                    ? `Idle: ${start} - ${end}`
                    : `Customer ${customer}<br>Start: ${start}<br>End: ${end}`;
            });
        
            section.addEventListener("mousemove", (event) => {
                const tooltipWidth = tooltip.offsetWidth;
                const tooltipHeight = tooltip.offsetHeight;
                const viewportWidth = window.innerWidth;
                const viewportHeight = window.innerHeight;
        
                let left = event.pageX + 10;
                let top = event.pageY + 10;
        
                if (left + tooltipWidth > viewportWidth) {
                    left = event.pageX - tooltipWidth - 10;
                }
        
                if (top + tooltipHeight > viewportHeight) {
                    top = event.pageY - tooltipHeight - 10;
                }
        
                tooltip.style.left = `${left}px`;
                tooltip.style.top = `${top}px`;
            });
        
            section.addEventListener("mouseleave", () => {
                tooltip.style.display = "none";
            });
        
            ganttChartContainer.appendChild(section);
        });
    }
    // function generateTimeLabels(Ganttchart) {
    //     const timeLabelsContainer = document.getElementById("timeLabels");
    //     timeLabelsContainer.innerHTML = "";  // Clear previous labels

    //     const totalTime = Ganttchart[Ganttchart.length - 1][1];  // Get the total end time

    //     // Create time labels at intervals (e.g., every 10 units of time)
    //     for (let i = 0; i <= totalTime; i += 10) {
    //         const label = document.createElement("div");
    //         label.classList.add("time-label");
    //         label.innerHTML = i;
    //         label.style.left = `${(i / totalTime) * 100}%`;  // Position the label according to the time
    //         timeLabelsContainer.appendChild(label);
    //     }
    // }

    // console.log("Ganttchart before calling generateGanttChart:", Ganttchart);
    generateGanttChart(Ganttchart, numCustomers);
    // generateTimeLabels(Ganttchart);
    const table = document.getElementById("simulation_table");
    let previousEndTime = 0;

    // Clear previous table rows
    while (table.rows.length > 1) {
        table.deleteRow(1);
    }

    const turnaround = [];
    const waittime = [];
    const restime = [];

    // Table for displaying results
    // const table = document.getElementById("simulation_table");

    // Calculate metrics for each customer
    for (let i = 0; i < customerData.length; i++) {
        const [startTime, endTime, customerId] = customerData[i];
        const arrivalTime = arrivalarray[customerId - 1]; // Arrival time for the specific customer
        const serviceTime = servicearray[customerId - 1]; // Service time for the specific customer
        const cpLookup = cplookuparray[customerId - 1]; // Cp Lookup for the specific customer
        const cp = cparray[customerId - 1]; // Cp for the specific customer
        const interArrival = interarrival[customerId - 1]; // Inter Arrival time
        const avgArrival = i; // Average time between arrivals (serial number here)

        // Calculate metrics
        const turnaroundTime = endTime - arrivalTime; // Turnaround time = End time - Arrival time
        const waitTime = turnaroundTime - serviceTime; // Wait time = Turnaround time - Service time
        const responseTime = startTime - arrivalTime; // Response time = Start time - Arrival time

        // Store the results
        turnaround.push(turnaroundTime);
        waittime.push(waitTime);
        restime.push(responseTime);


        // Insert a new row into the table
        const row = table.insertRow();
        row.insertCell(0).innerText = i + 1; // Serial Number
        row.insertCell(1).innerText = cpLookup; // Cp Lookup
        row.insertCell(2).innerText = cp; // Cp
        row.insertCell(3).innerText = avgArrival; // Avg Time Between Arrival
        row.insertCell(4).innerText = interArrival; // Inter Arrival
        row.insertCell(5).innerText = roundOff(arrivalTime); // Arrival Time
        row.insertCell(6).innerText = roundOff(serviceTime); // Service Time
        row.insertCell(7).innerText = roundOff(startTime); // Start Time
        row.insertCell(8).innerText = roundOff(endTime); // End Time
        row.insertCell(9).innerText = roundOff(turnaroundTime); // Turnaround Time
        row.insertCell(10).innerText = roundOff(waitTime); // Wait Time
        row.insertCell(11).innerText = roundOff(responseTime); // Response Time
        row.insertCell(12).innerText = "Server 1"; // Server

        // Log metrics for debugging
        console.log(
            `Customer ${customerId}: Turnaround = ${turnaroundTime}, Wait = ${waitTime},cp = ${cp},cplookup = ${cplookuparray}, Response = ${responseTime}`
        );
    }

    // Calculate server utilization and averages
    let totalServiceTime = 0;
    let totalIdleTime = 0;

    // Iterate over Gantt chart for server time calculations
    Ganttchart.forEach(([start, end, customer]) => {
        if (customer === -1) {
            totalIdleTime += end - start; // Idle time when no customer is served
        } else {
            totalServiceTime += end - start; // Service time for customers
        }
    });

    // Calculate total metrics
    const totalWaitTime = waittime.reduce((sum, wt) => sum + wt, 0);
    const totalTurnaroundTime = turnaround.reduce((sum, tat) => sum + tat, 0);
    const totalResponseTime = restime.reduce((sum, rt) => sum + rt, 0);
    const avgResponseTime = totalResponseTime / restime.length;

    // Compute averages
    const avgWaitTime = totalWaitTime / customerData.length;
    const avgTurnaroundTime = totalTurnaroundTime / customerData.length;

    // Compute server utilization
    const totalTime = totalServiceTime;
    const serverUtilization = (totalServiceTime / totalTime) * 100;

    // Log final results
    console.log("Average Wait Time:", avgWaitTime.toFixed(2));
    console.log("Average Turnaround Time:", avgTurnaroundTime.toFixed(2));
    console.log("Server Utilization:", serverUtilization.toFixed(2), "%");
    const serverUtil = document.getElementById("server-utilization");
    const avgTA = document.getElementById("avg-turnaround");
    const avgWT = document.getElementById("avg-wait");
    const avgRT = document.getElementById("avg-response");
    serverUtil.innerHTML = serverUtilization.toFixed(2) + "%";  // Add the percentage sign here
    avgTA.innerHTML = avgTurnaroundTime.toFixed(4);
    avgWT.innerHTML = avgWaitTime.toFixed(4);
    avgRT.innerHTML = avgResponseTime.toFixed(4);;



    function roundOff(value) {
        return Math.round(value);
    }
    renderArrivalLineGraph("arrivalLineGraph", interarrival)
    renderWaitTimeBarGraph(waittime, "waitTimeBarGraph")
    renderResponseTimeBarGraph(restime, "responseTimeBarGraph")
    renderTurnaroundTimeBarGraph(turnaround, "turnaroundTimeBarGraph")



}


// --------------------------------------- M/G/2 MODEL -------------------------------------------- // 

function generate_MG2_Table() {
    let params = {};
    const arrivalMean = parseFloat(document.getElementById('mean-arrival').value);
    let numCustomers = parseInt(document.getElementById("numCustomers").value);
    const numberOfServers = parseInt(document.getElementById("numServers").value, 10);


    const type = document.getElementById("serviceDistributionType").value;

    // const serviceMin = parseFloat(document.getElementById('service_min').value);
    // const serviceMax = parseFloat(document.getElementById('service_max').value);
    if (type === "uniform") {
        params.minvalue = document.getElementById("serviceUniformMin").value;
        params.maxvalue = document.getElementById("serviceUniformMax").value;
    } else if (type === "gamma") {
        params.mean = document.getElementById("serviceGammaAlpha").value;
        params.shape = document.getElementById("serviceGammaAlpha").value;
    } else if (type === "normal") {
        params.mean = document.getElementById("serviceNormalMean").value;
        params.sd = document.getElementById("serviceNormalSD").value;
    }
    console.log(params)
    // For The Cummulative Probablity 
    let interarrival = [];
    let arraymain = calculatePoissonCP(arrivalMean, numCustomers);
    console.log(arraymain);
    cparray = arraymain[0]
    cplookuparray = arraymain[1]
    // For calculating the inter arrival time 

    interarrival[0] = 0
    for (let i = 1; i < cparray.length; i++) {
        let random = Math.random();

        // Handle the case where random is exactly 0
        if (random === 0) {
            random += 0.1; // Adjust random if it's zero
        } else {
            let found = false;

            // Loop through cplookuparray and cparray to find the correct interarrival time
            for (let j = 0; j < cplookuparray.length; j++) {
                if (random > cplookuparray[j] && random < cparray[j]) {
                    interarrival[i] = j + 1;
                    found = true; // Mark that we've found the value
                    break; // Exit loop once we find the correct value
                }
            }

            // Additional condition if no match is found in the above loop
            if (!found) {
                interarrival[i] = Math.floor(Math.random() * cparray.length); // Assign a random integer from 0 to cparray.length - 1
            }
        }
    }

    let currentTime = 0;
    let arrivalarray = [];
    let servicearray = [];

    // let turnaround = [];
    // let waittime = [];
    let service = 0;
    // For calculating the Arrival time and Service Time.
    for (let i = 0; i < cparray.length; i++) {
        currentTime = currentTime + interarrival[i];
        arrivalarray[i] = currentTime;

        // Dynamically determine which random function to call
        if (type === "uniform") {
            service = uniformRandom(params.minvalue, params.maxvalue);
        } else if (type === "gamma") {
            service = gammaRandom(params.shape); // `shape` is beta for gammaRandom
        } else if (type === "normal") {
            console.log(`Mean: ${params.mean}, SD: ${params.sd}`); // Log the values
            service = normalRandom(params.mean, params.sd);
            console.log(`Generated Normal Random Service Time: ${service}`);
        }

        // Apply condition for the service value
        console.log(`Service before threshold check: ${service}`); // Log before threshold check
        if (Math.floor(service) == 0) {
            servicearray[i] = Math.ceil(service);
        } else {
            servicearray[i] = roundOff(service);
        }
        console.log(`Final service time for iteration ${i}: ${servicearray[i]}`); // Log final service time
    }




    console.log(arrivalarray)
    console.log(servicearray)
    const result = mmc(numberOfServers, arrivalarray, servicearray);

    console.log(result);
    const ganttCharts = result.ganttCharts;
    const customerData = result.customerData;
    const utilizations = result.utilization;
    console.log(utilizations)

    function generateGanttChart(Ganttchart, serverNumber) {
        const ganttChartContainer = document.getElementById(`ganttChartServer${serverNumber}`);
        ganttChartContainer.innerHTML = ""; // Clear any existing content

        // Create a tooltip element
        const tooltip = document.createElement("div");
        tooltip.id = "tooltip";
        document.body.appendChild(tooltip);

        // Validate the Ganttchart array
        if (!Ganttchart || Ganttchart.length === 0) {
            console.warn("Ganttchart is empty. Marking entire timeline as idle.");
            renderGanttSection(0, 100, -1, 100); // Total timeline is idle (dummy totalTime = 100).
            return;
        }

        // Calculate the total timeline length
        const totalTime = Ganttchart[Ganttchart.length - 1]?.[1] || 0;

        const colors = Array.from({ length: numCustomers }, (_, i) => {
            const hue = (i * 360) / numCustomers;
            const saturation = 70 + Math.random() * 30;
            const lightness = 30 + Math.random() * 20;
            return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
        });

        let previousIdleStart = null;
        let previousIdleEnd = null;

        Ganttchart.forEach(([start, end, customer, server], index) => {
            if (typeof start === "undefined" || typeof end === "undefined") {
                console.error(`Malformed Ganttchart entry at index ${index}:`, Ganttchart[index]);
                return;
            }

            if (server === serverNumber) {
                if (customer === -1) {
                    if (previousIdleStart === null) {
                        previousIdleStart = start;
                        previousIdleEnd = end;
                    } else if (previousIdleEnd === start) {
                        previousIdleEnd = end;
                    } else {
                        renderGanttSection(previousIdleStart, previousIdleEnd, -1, totalTime);
                        previousIdleStart = start;
                        previousIdleEnd = end;
                    }
                } else {
                    if (previousIdleStart !== null) {
                        renderGanttSection(previousIdleStart, previousIdleEnd, -1, totalTime);
                        previousIdleStart = null;
                        previousIdleEnd = null;
                    }
                    renderGanttSection(start, end, customer, totalTime);
                }
            }
        });

        if (previousIdleStart !== null) {
            renderGanttSection(previousIdleStart, previousIdleEnd, -1, totalTime);
        }

        function renderGanttSection(start, end, customer, totalTime) {
            const section = document.createElement("div");
            section.classList.add("gantt-section");
            const width = totalTime > 0 ? ((end - start) / totalTime) * 100 : 100;
            section.style.width = `${width}%`;
            section.style.left = `${(start / totalTime) * 100}%`;
            section.style.backgroundColor = customer === -1 ? "#ccc" : colors[customer - 1];

            section.addEventListener("mouseover", (event) => {
                tooltip.style.display = "block";
                tooltip.innerHTML = customer === -1
                    ? `Idle: ${start} - ${end}`
                    : `Customer ${customer}<br>Start: ${start}<br>End: ${end}`;
            });
        
            section.addEventListener("mousemove", (event) => {
                const tooltipWidth = tooltip.offsetWidth;
                const tooltipHeight = tooltip.offsetHeight;
                const viewportWidth = window.innerWidth;
                const viewportHeight = window.innerHeight;
        
                let left = event.pageX + 10;
                let top = event.pageY + 10;
        
                if (left + tooltipWidth > viewportWidth) {
                    left = event.pageX - tooltipWidth - 10;
                }
        
                if (top + tooltipHeight > viewportHeight) {
                    top = event.pageY - tooltipHeight - 10;
                }
        
                tooltip.style.left = `${left}px`;
                tooltip.style.top = `${top}px`;
            });
        
            section.addEventListener("mouseleave", () => {
                tooltip.style.display = "none";
            });
        
            ganttChartContainer.appendChild(section);
        }
    }
    // function generateTimeLabels(Ganttchart) {
    //     const timeLabelsContainer = document.getElementById("timeLabels");
    //     timeLabelsContainer.innerHTML = "";
    //     const totalTime = Ganttchart[Ganttchart.length - 1][1];

    //     for (let i = 0; i <= totalTime; i += 10) {
    //         const label = document.createElement("div");
    //         label.classList.add("time-label");
    //         label.innerHTML = i;
    //         label.style.left = `${(i / totalTime) * 100}%`;
    //         timeLabelsContainer.appendChild(label);
    //     }
    // }

    // generateGanttChart(GanttchartServer1, 1);
    // generateGanttChart(GanttchartServer2, 2);
    // generateTimeLabels(GanttchartServer1);

    const table = document.getElementById("simulation_table");
    while (table.rows.length > 1) {
        table.deleteRow(1);
    }

    const turnaround = [];
    const waittime = [];
    const restime = [];

    for (let i = 0; i < customerData.length; i++) {
        console.log(`Processing customer ${i + 1}`); // Debug log for loop iteration

        const { customer: customerId, server, start, end } = customerData[i];
        console.log(`Customer Data:`, { customerId, server, start, end }); // Log customer data

        const arrivalTime = arrivalarray[customerId - 1];
        const serviceTime = servicearray[customerId - 1];
        const cpLookup = cplookuparray[customerId - 1];
        const cp = cparray[customerId - 1];
        const interArrival = interarrival[customerId - 1];
        const avgArrival = i;

        console.log(`Arrival Time: ${arrivalTime}, Service Time: ${serviceTime}, Cp Lookup: ${cpLookup}, Cp: ${cp}`);
        console.log(`Inter Arrival: ${interArrival}, Avg Arrival: ${avgArrival}`);

        const turnaroundTime = end - arrivalTime;
        const waitTime = turnaroundTime - serviceTime;
        const responseTime = start - arrivalTime;

        console.log(`Calculated Metrics - Turnaround Time: ${turnaroundTime}, Wait Time: ${waitTime}, Response Time: ${responseTime}`);

        turnaround.push(turnaroundTime);
        waittime.push(waitTime);
        restime.push(responseTime);

        const row = table.insertRow();
        console.log(`Inserted new row into the table.`);

        row.insertCell(0).innerText = i + 1; // Serial Number
        row.insertCell(1).innerText = cpLookup; // Cp Lookup
        row.insertCell(2).innerText = cp; // Cp
        row.insertCell(3).innerText = avgArrival; // Avg Time Between Arrival
        row.insertCell(4).innerText = interArrival; // Inter Arrival
        row.insertCell(5).innerText = roundOff(arrivalTime); // Arrival Time
        row.insertCell(6).innerText = roundOff(serviceTime); // Service Time
        row.insertCell(7).innerText = roundOff(start); // Start Time
        row.insertCell(8).innerText = roundOff(end); // End Time
        row.insertCell(9).innerText = roundOff(turnaroundTime); // Turnaround Time
        row.insertCell(10).innerText = roundOff(waitTime); // Wait Time
        row.insertCell(11).innerText = roundOff(responseTime); // Response Time
        row.insertCell(12).innerText =
            server === 1 ? "Server 1" :
                server === 2 ? "Server 2" :
                    server === 3 ? "Server 3" :
                        server === 4 ? "Server 4" :
                            "Server 5";

        console.log(`Row for customer ${i + 1} added with Server ${server}.`);
    }
    function displayGanttCharts(numberOfServers) {
        // Loop through the possible server elements
        for (let i = 1; i <= 5; i++) {
            const titleElement = document.getElementById(`server${i}Title`);
            const chartElement = document.getElementById(`ganttChartServer${i}`);

            if (i <= numberOfServers) {
                // Remove the 'hidden' class for the required servers
                titleElement.classList.remove("hidden");
                chartElement.classList.remove("hidden");
            } else {
                // Ensure other servers remain hidden
                titleElement.classList.add("hidden");
                chartElement.classList.add("hidden");
            }
        }

        // Show the container if at least one server is active
        const container = document.getElementById("mm2GanttChart");
        if (numberOfServers > 0) {
            container.classList.remove("hidden");
        } else {
            container.classList.add("hidden");
        }
    }

    // Example usage: Call the function with the number of servers entered

    displayGanttCharts(numberOfServers);

    // Loop through the number of servers
    for (let serverIndex = 0; serverIndex < numberOfServers; serverIndex++) {
        console.log(`Processing Gantt chart for Server ${serverIndex + 1}`);

        // Extract the Gantt chart data for the current server
        const currentGanttChart = ganttCharts[serverIndex];

        console.log(`Gantt chart data for Server ${serverIndex + 1}:`, currentGanttChart);

        // Call the generateGanttChart function with the extracted data
        generateGanttChart(currentGanttChart, serverIndex + 1);
    }

    const totalWaitTime = waittime.reduce((sum, wt) => sum + wt, 0);
    const totalTurnaroundTime = turnaround.reduce((sum, tat) => sum + tat, 0);
    const totalResponseTime = restime.reduce((sum, rt) => sum + rt, 0);

    const avgWaitTime = totalWaitTime / customerData.length;
    const avgTurnaroundTime = totalTurnaroundTime / customerData.length;
    const avgResponseTime = totalResponseTime / restime.length;

    function updateUtilization(numberOfServers, utilizations) {
        // Get the Utilization Container
        const utilizationContainer = document.getElementById("mm2Utilization");

        // Show the container
        utilizationContainer.classList.remove("hidden");

        // Loop through the server utilization elements
        for (let i = 1; i <= 5; i++) {
            const utilizationElement = document.getElementById(`server${i}-utilization`);
            const utilizationLabel = utilizationElement.previousElementSibling;

            if (i <= numberOfServers) {
                // Show and set utilization value for active servers
                utilizationElement.classList.remove("hidden");
                utilizationLabel.classList.remove("hidden");

                // Set utilization value with 2 decimal places and a percent sign
                const utilizationValue = utilizations[i - 1];
                utilizationElement.innerText =
                    utilizationValue !== undefined
                        ? `${utilizationValue.toFixed(2)}%`
                        : "N/A"; // Display "N/A" if undefined
            } else {
                // Hide elements for inactive servers
                utilizationElement.classList.add("hidden");
                utilizationLabel.classList.add("hidden");
                utilizationElement.innerText = ""; // Clear the text
            }
        }
    }



    updateUtilization(numberOfServers, utilizations);


    const serverUtil1 = document.getElementById("server1-utilization");
    const serverUtil2 = document.getElementById("server2-utilization");
    const avgTA = document.getElementById("avg-turnaround");
    const avgWT = document.getElementById("avg-wait");
    const avgRT = document.getElementById("avg-response");

    // serverUtil1.innerHTML = serverUtilization1.toFixed(2) + "%";
    // serverUtil2.innerHTML = serverUtilization2.toFixed(2) + "%";
    avgTA.innerHTML = avgTurnaroundTime.toFixed(2);
    avgWT.innerHTML = avgWaitTime.toFixed(2);
    avgRT.innerHTML = avgResponseTime.toFixed(2);

    function exponentialRandom(mean) {
        return -Math.log(1 - Math.random()) * mean;
    }

    function roundOff(value) {
        return Math.round(value);
    }
    renderArrivalLineGraph("arrivalLineGraph", interarrival)
    renderWaitTimeBarGraph(waittime, "waitTimeBarGraph")
    renderResponseTimeBarGraph(restime, "responseTimeBarGraph")
    renderTurnaroundTimeBarGraph(turnaround, "turnaroundTimeBarGraph")



}

// -------------------------------------------- G/G/1 MODEL ----------------------------------------- //

function generate_GG1_Table() {
    let serParams = {};
    let arrParams = {};
    let numCustomers = parseInt(document.getElementById("numCustomers").value);

    const arrType = document.getElementById("distributionType").value;
    const serType = document.getElementById("serviceDistributionType").value;
    let interarrival = [];
    let arraymain = [];
    if (arrType === "uniform") {
        arrParams.minvalue = document.getElementById("uniformMin").value;
        arrParams.maxvalue = document.getElementById("uniformMax").value;
        arraymain = calculateUniformCP(arrParams.minvalue, arrParams.maxvalue, numCustomers);

    } else if (arrType === "gamma") {
        arrParams.mean = document.getElementById("gammaAlpha").value;
        arrParams.shape = document.getElementById("gammaBeta").value;
        arraymain = calculateGammaCP(arrParams.mean, arrParams.shape, numCustomers);


    } else if (arrType === "normal") {
        arrParams.mean = document.getElementById("normalMean").value;
        arrParams.sd = document.getElementById("normalSD").value;
        arraymain = calculateNormalCP(arrParams.mean, arrParams.sd, numCustomers);

    }
    console.log(arraymain)
    // const serviceMin = parseFloat(document.getElementById('service_min').value);
    // const serviceMax = parseFloat(document.getElementById('service_max').value);
    if (serType === "uniform") {
        serParams.minvalue = document.getElementById("serviceUniformMin").value;
        serParams.maxvalue = document.getElementById("serviceUniformMax").value;
    } else if (serType === "gamma") {
        serParams.mean = document.getElementById("serviceGammaAlpha").value;
        serParams.shape = document.getElementById("serviceGammaAlpha").value;
    } else if (serType === "normal") {
        serParams.mean = document.getElementById("serviceNormalMean").value;
        serParams.sd = document.getElementById("serviceNormalSD").value;
    }
    console.log(serParams)
    console.log(arrParams)

    // For The Cummulative Probablity 

    cparray = arraymain[0]
    cplookuparray = arraymain[1]
    // For calculating the inter arrival time 

    interarrival[0] = 0
    for (let i = 1; i < cparray.length; i++) {
        let random = Math.random();

        // Handle the case where random is exactly 0
        if (random === 0) {
            random += 0.1; // Adjust random if it's zero
        } else {
            let found = false;

            // Loop through cplookuparray and cparray to find the correct interarrival time
            for (let j = 0; j < cplookuparray.length; j++) {
                if (random > cplookuparray[j] && random < cparray[j]) {
                    interarrival[i] = j + 1;
                    found = true; // Mark that we've found the value
                    break; // Exit loop once we find the correct value
                }
            }

            // Additional condition if no match is found in the above loop
            if (!found) {
                interarrival[i] = Math.floor(Math.random() * cparray.length); // Assign a random integer from 0 to cparray.length - 1
            }
        }
    }


    let currentTime = 0;
    let arrivalarray = [];
    let servicearray = [];
    let starttime = [];
    let endtime = []
    // let turnaround = [];
    // let waittime = [];
    let service = 0;
    // For calculating the Arrival time and Service Time.
    for (let i = 0; i < cparray.length; i++) {
        currentTime = currentTime + interarrival[i];
        arrivalarray[i] = currentTime;

        // Dynamically determine which random function to call
        if (serType === "uniform") {
            service = uniformRandom(serParams.minvalue, serParams.maxvalue);
        } else if (serType === "gamma") {
            service = gammaRandom(serParams.shape); // `shape` is beta for gammaRandom
        } else if (serType === "normal") {
            console.log(`Mean: ${serParams.mean}, SD: ${serParams.sd}`); // Log the values
            service = normalRandom(serParams.mean, serParams.sd);
            console.log(`Generated Normal Random Service Time: ${service}`);
        }

        // Apply condition for the service value
        console.log(`Service before threshold check: ${service}`); // Log before threshold check
        if (Math.floor(service) == 0) {
            servicearray[i] = Math.ceil(service);
        } else {
            servicearray[i] = roundOff(service);
        }
        console.log(`Final service time for iteration ${i}: ${servicearray[i]}`); // Log final service time
    }




    console.log(servicearray)
    console.log(interarrival)
    let Ganttchart = [];  // Initialize an empty array to store Gantt chart data
    let check = 0;        // Variable to track the current time in the system (i.e., when the server is idle or serving a customer)
    let index = 0;        // Index to track the current customer being processed
    let customerData = [];  // Array to store customer data for output (start time, end time, customer ID)

    // Iterate until all customers are processed
    while (index < cparray.length) {

        // 1. Customer arrives at the current time
        if (arrivalarray[index] === check) {
            Ganttchart.push([check, check + servicearray[index], index + 1]);  // Add customer service data to Ganttchart
            customerData.push([check, check + servicearray[index], index + 1]);  // Add customer data for table output
            starttime[index] = check;
            endtime[index] = check + servicearray[index];
            check += servicearray[index];  // Update time after serving the customer
            index++;  // Move to the next customer
        }

        // 2. Customer arrives after idle time (server is idle)
        else if (arrivalarray[index] > check) {
            Ganttchart.push([check, arrivalarray[index], -1]);  // Add idle time to Ganttchart with ID -1 for visualization
            check = arrivalarray[index];  // Server is idle until the customer arrives
        }

        // 3. Customer arrives before the current time (overlap)
        else {
            Ganttchart.push([check, check + servicearray[index], index + 1]);  // Add customer service data to Ganttchart
            customerData.push([check, check + servicearray[index], index + 1]);  // Add customer data for table output
            starttime[index] = check;
            endtime[index] = check + servicearray[index];
            check += servicearray[index];  // Update time after serving the customer
            index++;  // Move to the next customer
        }
    }

    // Log the Gantt chart with idle time represented
    console.log("Ganttchart (including idle time):", Ganttchart);

    // Log the customer data for table output (without idle time)
    console.log("Customer Data (for table output):", customerData);

    for (let i = 0; i < customerData.length; i++) {
        for (let j = 0; j < 3; j++) {
            console.log(customerData[i] + '\n')

        }

    }
    // console.log(Ganttchart)
    function generateGanttChart(Ganttchart, numCustomers) {
        console.log("ganttchart function is called");
        console.log("Ganttchart Data:", Ganttchart);
        console.log("Number of Customers:", numCustomers);
        const ganttChartContainer = document.getElementById("ganttChart");

        // Clear previous Gantt chart
        ganttChartContainer.innerHTML = "";

        const tooltip = document.createElement("div");
        tooltip.id = "tooltip";
        document.body.appendChild(tooltip);

        // Assign a unique color for each customer (you can change the color scheme here)
        const colors = Array.from({ length: numCustomers }, (_, i) => {
            // Generate dark colors with high saturation and low lightness
            const hue = (i * 360) / numCustomers; // Evenly spaced hues
            const saturation = 70 + Math.random() * 30; // Random saturation between 70% to 100%
            const lightness = 30 + Math.random() * 20; // Dark lightness between 30% to 50%

            const color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
            return color;
        });

        // Loop over Ganttchart to display each customer and idle time
        Ganttchart.forEach(([start, end, customer], index) => {
            console.log(`Index: ${index}, Start: ${start}, End: ${end}, Customer: ${customer}`);
            const section = document.createElement("div");
            section.classList.add("gantt-section");

            // Set width for the section, based on its duration (start to end time)
            const width = ((end - start) / (Ganttchart[Ganttchart.length - 1][1])) * 100;  // Relative width based on total time
            section.style.width = `${width}%`;
            section.style.left = `${(start / (Ganttchart[Ganttchart.length - 1][1])) * 100}%`;  // Position the section based on start time
            // section.style.borderRadius = "6px";
            // Set background color based on customer or idle period
            if (customer === -1) {
                section.style.backgroundColor = "#ccc";  // Idle section color (light gray)
            } else {
                section.style.backgroundColor = colors[customer - 1];  // Customer section color
            }

            // Add hover information for tooltips
            section.addEventListener("mouseover", (event) => {
                tooltip.style.display = "block";
                tooltip.innerHTML = customer === -1
                    ? `Idle: ${start} - ${end}`
                    : `Customer ${customer}<br>Start: ${start}<br>End: ${end}`;
            });
        
            section.addEventListener("mousemove", (event) => {
                const tooltipWidth = tooltip.offsetWidth;
                const tooltipHeight = tooltip.offsetHeight;
                const viewportWidth = window.innerWidth;
                const viewportHeight = window.innerHeight;
        
                let left = event.pageX + 10;
                let top = event.pageY + 10;
        
                if (left + tooltipWidth > viewportWidth) {
                    left = event.pageX - tooltipWidth - 10;
                }
        
                if (top + tooltipHeight > viewportHeight) {
                    top = event.pageY - tooltipHeight - 10;
                }
        
                tooltip.style.left = `${left}px`;
                tooltip.style.top = `${top}px`;
            });
        
            section.addEventListener("mouseleave", () => {
                tooltip.style.display = "none";
            });
        
            ganttChartContainer.appendChild(section);
        });
    }
    // function generateTimeLabels(Ganttchart) {
    //     const timeLabelsContainer = document.getElementById("timeLabels");
    //     timeLabelsContainer.innerHTML = "";  // Clear previous labels

    //     const totalTime = Ganttchart[Ganttchart.length - 1][1];  // Get the total end time

    //     // Create time labels at intervals (e.g., every 10 units of time)
    //     for (let i = 0; i <= totalTime; i += 10) {
    //         const label = document.createElement("div");
    //         label.classList.add("time-label");
    //         label.innerHTML = i;
    //         label.style.left = `${(i / totalTime) * 100}%`;  // Position the label according to the time
    //         timeLabelsContainer.appendChild(label);
    //     }
    // }

    // console.log("Ganttchart before calling generateGanttChart:", Ganttchart);
    generateGanttChart(Ganttchart, numCustomers);
    // generateTimeLabels(Ganttchart);
    const table = document.getElementById("simulation_table");
    let previousEndTime = 0;

    // Clear previous table rows
    while (table.rows.length > 1) {
        table.deleteRow(1);
    }

    const turnaround = [];
    const waittime = [];
    const restime = [];

    // Table for displaying results
    // const table = document.getElementById("simulation_table");

    // Calculate metrics for each customer
    for (let i = 0; i < customerData.length; i++) {
        const [startTime, endTime, customerId] = customerData[i];
        const arrivalTime = arrivalarray[customerId - 1]; // Arrival time for the specific customer
        const serviceTime = servicearray[customerId - 1]; // Service time for the specific customer
        const cpLookup = cplookuparray[customerId - 1]; // Cp Lookup for the specific customer
        const cp = cparray[customerId - 1]; // Cp for the specific customer
        const interArrival = interarrival[customerId - 1]; // Inter Arrival time
        const avgArrival = i; // Average time between arrivals (serial number here)

        // Calculate metrics
        const turnaroundTime = endTime - arrivalTime; // Turnaround time = End time - Arrival time
        const waitTime = turnaroundTime - serviceTime; // Wait time = Turnaround time - Service time
        const responseTime = startTime - arrivalTime; // Response time = Start time - Arrival time

        // Store the results
        turnaround.push(turnaroundTime);
        waittime.push(waitTime);
        restime.push(responseTime);


        // Insert a new row into the table
        const row = table.insertRow();
        row.insertCell(0).innerText = i + 1; // Serial Number
        row.insertCell(1).innerText = cpLookup; // Cp Lookup
        row.insertCell(2).innerText = cp; // Cp
        row.insertCell(3).innerText = avgArrival; // Avg Time Between Arrival
        row.insertCell(4).innerText = interArrival; // Inter Arrival
        row.insertCell(5).innerText = roundOff(arrivalTime); // Arrival Time
        row.insertCell(6).innerText = roundOff(serviceTime); // Service Time
        row.insertCell(7).innerText = roundOff(startTime); // Start Time
        row.insertCell(8).innerText = roundOff(endTime); // End Time
        row.insertCell(9).innerText = roundOff(turnaroundTime); // Turnaround Time
        row.insertCell(10).innerText = roundOff(waitTime); // Wait Time
        row.insertCell(11).innerText = roundOff(responseTime); // Response Time
        row.insertCell(12).innerText = "Server 1"; // Server

        // Log metrics for debugging
        console.log(
            `Customer ${customerId}: Turnaround = ${turnaroundTime}, Wait = ${waitTime},cp = ${cp},cplookup = ${cplookuparray}, Response = ${responseTime}`
        );
    }

    // Calculate server utilization and averages
    let totalServiceTime = 0;
    let totalIdleTime = 0;

    // Iterate over Gantt chart for server time calculations
    Ganttchart.forEach(([start, end, customer]) => {
        if (customer === -1) {
            totalIdleTime += end - start; // Idle time when no customer is served
        } else {
            totalServiceTime += end - start; // Service time for customers
        }
    });

    // Calculate total metrics
    const totalWaitTime = waittime.reduce((sum, wt) => sum + wt, 0);
    const totalTurnaroundTime = turnaround.reduce((sum, tat) => sum + tat, 0);
    const totalResponseTime = restime.reduce((sum, rt) => sum + rt, 0);
    const avgResponseTime = totalResponseTime / restime.length;

    // Compute averages
    const avgWaitTime = totalWaitTime / customerData.length;
    const avgTurnaroundTime = totalTurnaroundTime / customerData.length;

    // Compute server utilization
    const totalTime = totalServiceTime;
    const serverUtilization = (totalServiceTime / totalTime) * 100;

    // Log final results
    console.log("Average Wait Time:", avgWaitTime.toFixed(2));
    console.log("Average Turnaround Time:", avgTurnaroundTime.toFixed(2));
    console.log("Server Utilization:", serverUtilization.toFixed(2), "%");
    const serverUtil = document.getElementById("server-utilization");
    const avgTA = document.getElementById("avg-turnaround");
    const avgWT = document.getElementById("avg-wait");
    const avgRT = document.getElementById("avg-response");
    serverUtil.innerHTML = serverUtilization.toFixed(2) + "%";  // Add the percentage sign here
    avgTA.innerHTML = avgTurnaroundTime.toFixed(4);
    avgWT.innerHTML = avgWaitTime.toFixed(4);
    avgRT.innerHTML = avgResponseTime.toFixed(4);;



    function roundOff(value) {
        return Math.round(value);
    }
    renderArrivalLineGraph("arrivalLineGraph", interarrival)
    renderWaitTimeBarGraph(waittime, "waitTimeBarGraph")
    renderResponseTimeBarGraph(restime, "responseTimeBarGraph")
    renderTurnaroundTimeBarGraph(turnaround, "turnaroundTimeBarGraph")



}


// ----------------------------------------- G/G/2 MODEL -------------------------------------------- // 

function generate_GG2_Table() {
    let serParams = {};
    let arrParams = {};
    let numCustomers = parseInt(document.getElementById("numCustomers").value);
    const numberOfServers = parseInt(document.getElementById("numServers").value, 10);


    const arrType = document.getElementById("distributionType").value;
    const serType = document.getElementById("serviceDistributionType").value;
    let interarrival = [];
    let arraymain = [];
    if (arrType === "uniform") {
        arrParams.minvalue = document.getElementById("uniformMin").value;
        arrParams.maxvalue = document.getElementById("uniformMax").value;
        arraymain = calculateUniformCP(arrParams.minvalue, arrParams.maxvalue, numCustomers);

    } else if (arrType === "gamma") {
        arrParams.mean = document.getElementById("gammaAlpha").value;
        arrParams.shape = document.getElementById("gammaBeta").value;
        arraymain = calculateGammaCP(arrParams.mean, arrParams.shape, numCustomers);


    } else if (arrType === "normal") {
        arrParams.mean = document.getElementById("normalMean").value;
        arrParams.sd = document.getElementById("normalSD").value;
        arraymain = calculateNormalCP(arrParams.mean, arrParams.sd, numCustomers);

    }
    console.log(arraymain)
    // const serviceMin = parseFloat(document.getElementById('service_min').value);
    // const serviceMax = parseFloat(document.getElementById('service_max').value);
    if (serType === "uniform") {
        serParams.minvalue = document.getElementById("serviceUniformMin").value;
        serParams.maxvalue = document.getElementById("serviceUniformMax").value;
    } else if (serType === "gamma") {
        serParams.mean = document.getElementById("serviceGammaAlpha").value;
        serParams.shape = document.getElementById("serviceGammaAlpha").value;
    } else if (serType === "normal") {
        serParams.mean = document.getElementById("serviceNormalMean").value;
        serParams.sd = document.getElementById("serviceNormalSD").value;
    }
    console.log(serParams)
    console.log(arrParams)

    // For The Cummulative Probablity 

    cparray = arraymain[0]
    cplookuparray = arraymain[1]
    // For calculating the inter arrival time 

    interarrival[0] = 0
    for (let i = 1; i < cparray.length; i++) {
        let random = Math.random();

        // Handle the case where random is exactly 0
        if (random === 0) {
            random += 0.1; // Adjust random if it's zero
        } else {
            let found = false;

            // Loop through cplookuparray and cparray to find the correct interarrival time
            for (let j = 0; j < cplookuparray.length; j++) {
                if (random > cplookuparray[j] && random < cparray[j]) {
                    interarrival[i] = j + 1;
                    found = true; // Mark that we've found the value
                    break; // Exit loop once we find the correct value
                }
            }

            // Additional condition if no match is found in the above loop
            if (!found) {
                interarrival[i] = Math.floor(Math.random() * cparray.length); // Assign a random integer from 0 to cparray.length - 1
            }
        }
    }


    let currentTime = 0;
    let arrivalarray = [];
    let servicearray = [];
    let starttime = [];
    let endtime = []
    // let turnaround = [];
    // let waittime = [];
    let service = 0;
    // For calculating the Arrival time and Service Time.
    for (let i = 0; i < cparray.length; i++) {
        currentTime = currentTime + interarrival[i];
        arrivalarray[i] = currentTime;

        // Dynamically determine which random function to call
        if (serType === "uniform") {
            service = uniformRandom(serParams.minvalue, serParams.maxvalue);
        } else if (serType === "gamma") {
            service = gammaRandom(serParams.shape); // `shape` is beta for gammaRandom
        } else if (serType === "normal") {
            console.log(`Mean: ${serParams.mean}, SD: ${serParams.sd}`); // Log the values
            service = normalRandom(serParams.mean, serParams.sd);
            console.log(`Generated Normal Random Service Time: ${service}`);
        }

        // Apply condition for the service value
        console.log(`Service before threshold check: ${service}`); // Log before threshold check
        if (Math.floor(service) == 0) {
            servicearray[i] = Math.ceil(service);
        } else {
            servicearray[i] = roundOff(service);
        }
        console.log(`Final service time for iteration ${i}: ${servicearray[i]}`); // Log final service time
    }

    console.log(arrivalarray)
    console.log(servicearray)
    const result = mmc(numberOfServers, arrivalarray, servicearray);

    console.log(result);
    const ganttCharts = result.ganttCharts;
    const customerData = result.customerData;
    const utilizations = result.utilization;
    console.log(utilizations)

    function generateGanttChart(Ganttchart, serverNumber) {
        const ganttChartContainer = document.getElementById(`ganttChartServer${serverNumber}`);
        ganttChartContainer.innerHTML = ""; // Clear any existing content

        // Create a tooltip element
        const tooltip = document.createElement("div");
        tooltip.id = "tooltip";
        document.body.appendChild(tooltip);

        // Validate the Ganttchart array
        if (!Ganttchart || Ganttchart.length === 0) {
            console.warn("Ganttchart is empty. Marking entire timeline as idle.");
            renderGanttSection(0, 100, -1, 100); // Total timeline is idle (dummy totalTime = 100).
            return;
        }

        // Calculate the total timeline length
        const totalTime = Ganttchart[Ganttchart.length - 1]?.[1] || 0;

        const colors = Array.from({ length: numCustomers }, (_, i) => {
            const hue = (i * 360) / numCustomers;
            const saturation = 70 + Math.random() * 30;
            const lightness = 30 + Math.random() * 20;
            return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
        });

        let previousIdleStart = null;
        let previousIdleEnd = null;

        Ganttchart.forEach(([start, end, customer, server], index) => {
            if (typeof start === "undefined" || typeof end === "undefined") {
                console.error(`Malformed Ganttchart entry at index ${index}:`, Ganttchart[index]);
                return;
            }

            if (server === serverNumber) {
                if (customer === -1) {
                    if (previousIdleStart === null) {
                        previousIdleStart = start;
                        previousIdleEnd = end;
                    } else if (previousIdleEnd === start) {
                        previousIdleEnd = end;
                    } else {
                        renderGanttSection(previousIdleStart, previousIdleEnd, -1, totalTime);
                        previousIdleStart = start;
                        previousIdleEnd = end;
                    }
                } else {
                    if (previousIdleStart !== null) {
                        renderGanttSection(previousIdleStart, previousIdleEnd, -1, totalTime);
                        previousIdleStart = null;
                        previousIdleEnd = null;
                    }
                    renderGanttSection(start, end, customer, totalTime);
                }
            }
        });

        if (previousIdleStart !== null) {
            renderGanttSection(previousIdleStart, previousIdleEnd, -1, totalTime);
        }

        function renderGanttSection(start, end, customer, totalTime) {
            const section = document.createElement("div");
            section.classList.add("gantt-section");
            const width = totalTime > 0 ? ((end - start) / totalTime) * 100 : 100;
            section.style.width = `${width}%`;
            section.style.left = `${(start / totalTime) * 100}%`;
            section.style.backgroundColor = customer === -1 ? "#ccc" : colors[customer - 1];

            section.addEventListener("mouseover", (event) => {
                tooltip.style.display = "block";
                tooltip.innerHTML = customer === -1
                    ? `Idle: ${start} - ${end}`
                    : `Customer ${customer}<br>Start: ${start}<br>End: ${end}`;
            });
        
            section.addEventListener("mousemove", (event) => {
                const tooltipWidth = tooltip.offsetWidth;
                const tooltipHeight = tooltip.offsetHeight;
                const viewportWidth = window.innerWidth;
                const viewportHeight = window.innerHeight;
        
                let left = event.pageX + 10;
                let top = event.pageY + 10;
        
                if (left + tooltipWidth > viewportWidth) {
                    left = event.pageX - tooltipWidth - 10;
                }
        
                if (top + tooltipHeight > viewportHeight) {
                    top = event.pageY - tooltipHeight - 10;
                }
        
                tooltip.style.left = `${left}px`;
                tooltip.style.top = `${top}px`;
            });
        
            section.addEventListener("mouseleave", () => {
                tooltip.style.display = "none";
            });
        
            ganttChartContainer.appendChild(section);
        }
    }


    // function generateTimeLabels(Ganttchart) {
    //     const timeLabelsContainer = document.getElementById("timeLabels");
    //     timeLabelsContainer.innerHTML = "";
    //     const totalTime = Ganttchart[Ganttchart.length - 1][1];

    //     for (let i = 0; i <= totalTime; i += 10) {
    //         const label = document.createElement("div");
    //         label.classList.add("time-label");
    //         label.innerHTML = i;
    //         label.style.left = `${(i / totalTime) * 100}%`;
    //         timeLabelsContainer.appendChild(label);
    //     }
    // }

    // generateGanttChart(GanttchartServer1, 1);
    // generateGanttChart(GanttchartServer2, 2);
    // generateTimeLabels(GanttchartServer1);

    const table = document.getElementById("simulation_table");
    while (table.rows.length > 1) {
        table.deleteRow(1);
    }

    const turnaround = [];
    const waittime = [];
    const restime = [];

    for (let i = 0; i < customerData.length; i++) {
        console.log(`Processing customer ${i + 1}`); // Debug log for loop iteration

        const { customer: customerId, server, start, end } = customerData[i];
        console.log(`Customer Data:`, { customerId, server, start, end }); // Log customer data

        const arrivalTime = arrivalarray[customerId - 1];
        const serviceTime = servicearray[customerId - 1];
        const cpLookup = cplookuparray[customerId - 1];
        const cp = cparray[customerId - 1];
        const interArrival = interarrival[customerId - 1];
        const avgArrival = i;

        console.log(`Arrival Time: ${arrivalTime}, Service Time: ${serviceTime}, Cp Lookup: ${cpLookup}, Cp: ${cp}`);
        console.log(`Inter Arrival: ${interArrival}, Avg Arrival: ${avgArrival}`);

        const turnaroundTime = end - arrivalTime;
        const waitTime = turnaroundTime - serviceTime;
        const responseTime = start - arrivalTime;

        console.log(`Calculated Metrics - Turnaround Time: ${turnaroundTime}, Wait Time: ${waitTime}, Response Time: ${responseTime}`);

        turnaround.push(turnaroundTime);
        waittime.push(waitTime);
        restime.push(responseTime);

        const row = table.insertRow();
        console.log(`Inserted new row into the table.`);

        row.insertCell(0).innerText = i + 1; // Serial Number
        row.insertCell(1).innerText = cpLookup; // Cp Lookup
        row.insertCell(2).innerText = cp; // Cp
        row.insertCell(3).innerText = avgArrival; // Avg Time Between Arrival
        row.insertCell(4).innerText = interArrival; // Inter Arrival
        row.insertCell(5).innerText = roundOff(arrivalTime); // Arrival Time
        row.insertCell(6).innerText = roundOff(serviceTime); // Service Time
        row.insertCell(7).innerText = roundOff(start); // Start Time
        row.insertCell(8).innerText = roundOff(end); // End Time
        row.insertCell(9).innerText = roundOff(turnaroundTime); // Turnaround Time
        row.insertCell(10).innerText = roundOff(waitTime); // Wait Time
        row.insertCell(11).innerText = roundOff(responseTime); // Response Time
        row.insertCell(12).innerText =
            server === 1 ? "Server 1" :
                server === 2 ? "Server 2" :
                    server === 3 ? "Server 3" :
                        server === 4 ? "Server 4" :
                            "Server 5";

        console.log(`Row for customer ${i + 1} added with Server ${server}.`);
    }
    function displayGanttCharts(numberOfServers) {
        // Loop through the possible server elements
        for (let i = 1; i <= 5; i++) {
            const titleElement = document.getElementById(`server${i}Title`);
            const chartElement = document.getElementById(`ganttChartServer${i}`);

            if (i <= numberOfServers) {
                // Remove the 'hidden' class for the required servers
                titleElement.classList.remove("hidden");
                chartElement.classList.remove("hidden");
            } else {
                // Ensure other servers remain hidden
                titleElement.classList.add("hidden");
                chartElement.classList.add("hidden");
            }
        }

        // Show the container if at least one server is active
        const container = document.getElementById("mm2GanttChart");
        if (numberOfServers > 0) {
            container.classList.remove("hidden");
        } else {
            container.classList.add("hidden");
        }
    }

    // Example usage: Call the function with the number of servers entered

    displayGanttCharts(numberOfServers);

    // Loop through the number of servers
    for (let serverIndex = 0; serverIndex < numberOfServers; serverIndex++) {
        console.log(`Processing Gantt chart for Server ${serverIndex + 1}`);

        // Extract the Gantt chart data for the current server
        const currentGanttChart = ganttCharts[serverIndex];

        console.log(`Gantt chart data for Server ${serverIndex + 1}:`, currentGanttChart);

        // Call the generateGanttChart function with the extracted data
        generateGanttChart(currentGanttChart, serverIndex + 1);
    }

    const totalWaitTime = waittime.reduce((sum, wt) => sum + wt, 0);
    const totalTurnaroundTime = turnaround.reduce((sum, tat) => sum + tat, 0);
    const totalResponseTime = restime.reduce((sum, rt) => sum + rt, 0);

    const avgWaitTime = totalWaitTime / customerData.length;
    const avgTurnaroundTime = totalTurnaroundTime / customerData.length;
    const avgResponseTime = totalResponseTime / restime.length;

    function updateUtilization(numberOfServers, utilizations) {
        // Get the Utilization Container
        const utilizationContainer = document.getElementById("mm2Utilization");

        // Show the container
        utilizationContainer.classList.remove("hidden");

        // Loop through the server utilization elements
        for (let i = 1; i <= 5; i++) {
            const utilizationElement = document.getElementById(`server${i}-utilization`);
            const utilizationLabel = utilizationElement.previousElementSibling;

            if (i <= numberOfServers) {
                // Show and set utilization value for active servers
                utilizationElement.classList.remove("hidden");
                utilizationLabel.classList.remove("hidden");

                // Set utilization value with 2 decimal places and a percent sign
                const utilizationValue = utilizations[i - 1];
                utilizationElement.innerText =
                    utilizationValue !== undefined
                        ? `${utilizationValue.toFixed(2)}%`
                        : "N/A"; // Display "N/A" if undefined
            } else {
                // Hide elements for inactive servers
                utilizationElement.classList.add("hidden");
                utilizationLabel.classList.add("hidden");
                utilizationElement.innerText = ""; // Clear the text
            }
        }
    }



    updateUtilization(numberOfServers, utilizations);


    const serverUtil1 = document.getElementById("server1-utilization");
    const serverUtil2 = document.getElementById("server2-utilization");
    const avgTA = document.getElementById("avg-turnaround");
    const avgWT = document.getElementById("avg-wait");
    const avgRT = document.getElementById("avg-response");

    // serverUtil1.innerHTML = serverUtilization1.toFixed(2) + "%";
    // serverUtil2.innerHTML = serverUtilization2.toFixed(2) + "%";
    avgTA.innerHTML = avgTurnaroundTime.toFixed(2);
    avgWT.innerHTML = avgWaitTime.toFixed(2);
    avgRT.innerHTML = avgResponseTime.toFixed(2);

    function exponentialRandom(mean) {
        return -Math.log(1 - Math.random()) * mean;
    }

    function roundOff(value) {
        return Math.round(value);
    }
    renderArrivalLineGraph("arrivalLineGraph", interarrival)
    renderWaitTimeBarGraph(waittime, "waitTimeBarGraph")
    renderResponseTimeBarGraph(restime, "responseTimeBarGraph")
    renderTurnaroundTimeBarGraph(turnaround, "turnaroundTimeBarGraph")



}

// ------------------------------ Calculate Button  ------------------------------------------------ // 
function renderArrivalLineGraph(containerId, arrivalarray) {
    const container = document.getElementById(containerId);
    container.innerHTML = ""; // Clear any existing content

    // Create the canvas element and append it to the container
    const canvas = document.createElement("canvas");
    canvas.id = "arrivalChart";
    canvas.width = 1000; // Set canvas width (increase as needed)
    canvas.height = 500; // Set canvas height (adjust as needed)
    container.appendChild(canvas);

    // Prepare data for the chart
    const customers = Object.keys(arrivalarray).map((key) => `C${parseInt(key) + 1}`);
    const arrivalTimes = Object.values(arrivalarray);

    // Chart.js configuration
    const chartConfig = {
        type: "line", // Line chart type
        data: {
            labels: customers, // X-axis labels (Customer IDs)
            datasets: [{
                label: "InterArrival Times",
                data: arrivalTimes, // Y-axis values (Arrival Times)
                fill: false,
                borderColor: "blue",
                tension: 0.1,
                pointRadius: 5, // Radius of data points
                pointHoverRadius: 10, // Hover radius for tooltips
            }],
        },
        options: {
            responsive: true, // Make the chart responsive
            plugins: {
                tooltip: {
                    enabled: true, // Enable tooltips
                    callbacks: {
                        label: function (tooltipItem) {
                            // Format tooltip text to show customer and arrival time
                            return `Customer ${tooltipItem.label}, Inter-arrival Time: ${tooltipItem.raw}`;
                        },
                    },
                    // Tooltip size customization
                    bodyFont: {
                        size: 18, // Increase font size for tooltip text
                        family: "Arial", // Font family
                        weight: "bold", // Font weight for bold text
                    },
                    padding: 15, // Increase padding for larger tooltip
                    backgroundColor: "rgba(0, 0, 0, 0.8)", // Tooltip background color
                    titleFont: {
                        size: 20, // Title font size
                        weight: "bold", // Title font weight
                    },
                    titleColor: "#ffffff", // Tooltip title color
                    bodyColor: "#ffffff", // Tooltip body text color
                },
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: "Customers", // Label for the X-axis
                    },
                },
                y: {
                    title: {
                        display: true,
                        text: "Inter-arrival Times", // Label for the Y-axis
                    },
                },
            },
        },
    };

    // Create the chart
    const arrivalChart = new Chart(canvas, chartConfig);
}


function renderWaitTimeBarGraph(waitTimes, containerId) {
    const barGraphContainer = document.getElementById(containerId);
    barGraphContainer.innerHTML = ""; // Clear previous content

    // Create a tooltip for hover effect
    const tooltip = document.createElement("div");
    tooltip.id = "tooltip";
    tooltip.style.position = "absolute";
    tooltip.style.display = "none";
    tooltip.style.padding = "10px"; // Increased padding for larger tooltip
    tooltip.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
    tooltip.style.color = "white";
    tooltip.style.borderRadius = "6px"; // Increased border radius
    tooltip.style.fontSize = "16px"; // Increased font size
    tooltip.style.maxWidth = "200px"; // Set a max width to ensure it fits on the screen
    tooltip.style.whiteSpace = "normal"; // Allow text to wrap
    tooltip.style.wordWrap = "break-word"; // Break long words
    document.body.appendChild(tooltip);

    // Set up container style
    barGraphContainer.style.display = "flex";
    barGraphContainer.style.alignItems = "flex-end";
    barGraphContainer.style.height = "265px"; // Fixed height for the graph
    barGraphContainer.style.border = "1px solid #ccc";
    barGraphContainer.style.padding = "10px";
    barGraphContainer.style.boxSizing = "border-box";
    barGraphContainer.style.width = "100%"; // Fixed container width

    // Check if customers exceed 50 and enable scrolling
    const totalCustomers = Object.keys(waitTimes).length;
    let barWidth; // Initialize the bar width

    if (totalCustomers > 40) {
        barGraphContainer.style.overflowX = "auto"; // Enable horizontal scrolling
        barGraphContainer.style.justifyContent = "flex-start"; // Align items to the left for scrolling
        barGraphContainer.style.paddingTop = "10px";
        barWidth = 40; // Fixed bar width for more than 50 customers
    } else {
        barGraphContainer.style.justifyContent = "space-between"; // Default alignment
        const containerWidth = barGraphContainer.clientWidth;
        barWidth = Math.max(10, Math.floor(containerWidth / (totalCustomers * 1.5))); // Dynamically calculate bar width
    }

    // Find the maximum wait time for normalization
    const maxWaitTime = Math.max(...Object.values(waitTimes));
    const maxBarHeight = 200; // Maximum height for a bar in pixels

    // Generate unique colors for bars
    const colors = Array.from({ length: totalCustomers }, (_, i) => {
        const hue = (i * 360) / totalCustomers;
        const saturation = 70 + Math.random() * 30;
        const lightness = 50 + Math.random() * 20;
        return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    });

    // Render bars
    Object.entries(waitTimes).forEach(([customer, waitTime], index) => {
        const bar = document.createElement("div");
        bar.classList.add("bar");

        // Normalize bar height
        const normalizedHeight = waitTime === 0 ? 0 : (waitTime / maxWaitTime) * maxBarHeight;
        bar.style.width = `${barWidth}px`;
        bar.style.height = `${normalizedHeight}px`;
        bar.style.backgroundColor = colors[index];
        bar.style.transition = "height 0.3s, background-color 0.3s";

        // Tooltip on hover
        bar.addEventListener("mouseover", (event) => {
            tooltip.style.display = "block";
            tooltip.innerHTML = `Customer ${parseInt(customer) + 1}<br>Wait Time: ${waitTime === 0 ? "No data" : waitTime}`;
            tooltip.style.left = `${event.pageX + 10}px`;
            tooltip.style.top = `${event.pageY + 10}px`;

            // Prevent tooltip from going outside the window
            const tooltipRect = tooltip.getBoundingClientRect();
            const screenWidth = window.innerWidth;
            const screenHeight = window.innerHeight;

            // Adjust tooltip position if it's too close to the edge of the screen
            if (tooltipRect.right > screenWidth) {
                tooltip.style.left = `${event.pageX - tooltipRect.width - 10}px`;
            }
            if (tooltipRect.bottom > screenHeight) {
                tooltip.style.top = `${event.pageY - tooltipRect.height - 10}px`;
            }
        });

        bar.addEventListener("mouseleave", () => {
            tooltip.style.display = "none";
        });

        // Add label below the bar
        const label = document.createElement("div");
        label.classList.add("bar-label");
        label.style.textAlign = "center";
        label.style.marginTop = "5px";
        label.style.fontSize = "12px";
        label.innerText = `C${parseInt(customer) + 1}`;

        // Container for bar and label
        const barContainer = document.createElement("div");
        barContainer.style.display = "flex";
        barContainer.style.flexDirection = "column";
        barContainer.style.alignItems = "center";
        barContainer.style.marginRight = "5px";

        barContainer.appendChild(bar);
        barContainer.appendChild(label);

        barGraphContainer.appendChild(barContainer);
    });
}


function renderResponseTimeBarGraph(responseTimes, containerId) {
    const barGraphContainer = document.getElementById(containerId);
    barGraphContainer.innerHTML = ""; // Clear previous content

    // Create a tooltip for hover effect
    const tooltip = document.createElement("div");
    tooltip.id = "tooltip";
    tooltip.style.position = "absolute";
    tooltip.style.display = "none";
    tooltip.style.padding = "10px"; // Increased padding
    tooltip.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
    tooltip.style.color = "white";
    tooltip.style.borderRadius = "6px"; // Increased border radius
    tooltip.style.fontSize = "16px"; // Increased font size
    tooltip.style.maxWidth = "200px"; // Set a max width to ensure it fits on the screen
    tooltip.style.whiteSpace = "normal"; // Allow text to wrap
    tooltip.style.wordWrap = "break-word"; // Break long words
    document.body.appendChild(tooltip);

    // Set up container style
    barGraphContainer.style.display = "flex";
    barGraphContainer.style.alignItems = "flex-end";
    barGraphContainer.style.height = "265px"; // Fixed height for the graph
    barGraphContainer.style.border = "1px solid #ccc";
    barGraphContainer.style.padding = "10px";
    barGraphContainer.style.boxSizing = "border-box";
    barGraphContainer.style.width = "100%"; // Fixed container width

    // Check if customers exceed 50 and enable scrolling
    const totalCustomers = Object.keys(responseTimes).length;
    let barWidth; // Initialize the bar width

    if (totalCustomers > 40) {
        barGraphContainer.style.overflowX = "auto"; // Enable horizontal scrolling
        barGraphContainer.style.justifyContent = "flex-start"; // Align items to the left for scrolling
        barGraphContainer.style.paddingTop = "10px";
        barWidth = 40; // Fixed bar width for more than 50 customers
    } else {
        barGraphContainer.style.justifyContent = "space-between"; // Default alignment
        const containerWidth = barGraphContainer.clientWidth;
        barWidth = Math.max(10, Math.floor(containerWidth / (totalCustomers * 1.5))); // Dynamically calculate bar width
    }

    // Find the maximum response time for normalization
    const maxResponseTime = Math.max(...Object.values(responseTimes));
    const maxBarHeight = 200; // Maximum height for a bar in pixels

    // Generate unique colors for bars
    const colors = Array.from({ length: totalCustomers }, (_, i) => {
        const hue = (i * 360) / totalCustomers;
        const saturation = 70 + Math.random() * 30;
        const lightness = 50 + Math.random() * 20;
        return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    });

    // Render bars
    Object.entries(responseTimes).forEach(([customer, responseTime], index) => {
        const bar = document.createElement("div");
        bar.classList.add("bar");

        // Normalize bar height
        const normalizedHeight = responseTime === 0 ? 0 : (responseTime / maxResponseTime) * maxBarHeight;
        bar.style.width = `${barWidth}px`;
        bar.style.height = `${normalizedHeight}px`;
        bar.style.backgroundColor = colors[index];
        bar.style.transition = "height 0.3s, background-color 0.3s";

        // Tooltip on hover
        bar.addEventListener("mouseover", (event) => {
            tooltip.style.display = "block";
            tooltip.innerHTML = `Customer ${parseInt(customer) + 1}<br>Response Time: ${responseTime === 0 ? "No data" : responseTime}`;
            tooltip.style.left = `${event.pageX + 10}px`;
            tooltip.style.top = `${event.pageY + 10}px`;

            // Prevent tooltip from going outside the window
            const tooltipRect = tooltip.getBoundingClientRect();
            const screenWidth = window.innerWidth;
            const screenHeight = window.innerHeight;

            // Adjust tooltip position if it's too close to the edge of the screen
            if (tooltipRect.right > screenWidth) {
                tooltip.style.left = `${event.pageX - tooltipRect.width - 10}px`;
            }
            if (tooltipRect.bottom > screenHeight) {
                tooltip.style.top = `${event.pageY - tooltipRect.height - 10}px`;
            }
        });

        bar.addEventListener("mouseleave", () => {
            tooltip.style.display = "none";
        });

        // Add label below the bar
        const label = document.createElement("div");
        label.classList.add("bar-label");
        label.style.textAlign = "center";
        label.style.marginTop = "5px";
        label.style.fontSize = "12px";
        label.innerText = `C${parseInt(customer) + 1}`;

        // Container for bar and label
        const barContainer = document.createElement("div");
        barContainer.style.display = "flex";
        barContainer.style.flexDirection = "column";
        barContainer.style.alignItems = "center";
        barContainer.style.marginRight = "5px";

        barContainer.appendChild(bar);
        barContainer.appendChild(label);

        barGraphContainer.appendChild(barContainer);
    });
}


function renderTurnaroundTimeBarGraph(turnaroundTimes, containerId) {
    const barGraphContainer = document.getElementById(containerId);
    barGraphContainer.innerHTML = ""; // Clear previous content

    // Create a tooltip for hover effect
    const tooltip = document.createElement("div");
    tooltip.id = "tooltip";
    tooltip.style.position = "absolute";
    tooltip.style.display = "none";
    tooltip.style.padding = "10px"; // Increased padding for larger tooltip
    tooltip.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
    tooltip.style.color = "white";
    tooltip.style.borderRadius = "6px"; // Increased border radius
    tooltip.style.fontSize = "16px"; // Increased font size
    tooltip.style.maxWidth = "200px"; // Set a max width to ensure it fits on the screen
    tooltip.style.whiteSpace = "normal"; // Allow text to wrap
    tooltip.style.wordWrap = "break-word"; // Break long words
    document.body.appendChild(tooltip);

    // Set up container style
    barGraphContainer.style.display = "flex";
    barGraphContainer.style.alignItems = "flex-end";
    barGraphContainer.style.height = "265px"; // Fixed height for the graph
    barGraphContainer.style.border = "1px solid #ccc";
    barGraphContainer.style.padding = "10px";
    barGraphContainer.style.boxSizing = "border-box";
    barGraphContainer.style.width = "100%"; // Fixed container width

    // Check if customers exceed 50 and enable scrolling
    const totalCustomers = Object.keys(turnaroundTimes).length;
    let barWidth; // Initialize the bar width

    if (totalCustomers > 40) {
        barGraphContainer.style.overflowX = "auto"; // Enable horizontal scrolling
        barGraphContainer.style.justifyContent = "flex-start"; // Align items to the left for scrolling
        barGraphContainer.style.paddingTop = "10px";
        barWidth = 40; // Fixed bar width for more than 50 customers
    } else {
        barGraphContainer.style.justifyContent = "space-between"; // Default alignment
        const containerWidth = barGraphContainer.clientWidth;
        barWidth = Math.max(10, Math.floor(containerWidth / (totalCustomers * 1.5))); // Dynamically calculate bar width
    }

    // Find the maximum turnaround time for normalization
    const maxTurnaroundTime = Math.max(...Object.values(turnaroundTimes));
    const maxBarHeight = 200; // Maximum height for a bar in pixels

    // Generate unique colors for bars
    const colors = Array.from({ length: totalCustomers }, (_, i) => {
        const hue = (i * 360) / totalCustomers;
        const saturation = 70 + Math.random() * 30;
        const lightness = 50 + Math.random() * 20;
        return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    });

    // Render bars
    Object.entries(turnaroundTimes).forEach(([customer, turnaroundTime], index) => {
        const bar = document.createElement("div");
        bar.classList.add("bar");

        // Normalize bar height
        const normalizedHeight = turnaroundTime === 0 ? 0 : (turnaroundTime / maxTurnaroundTime) * maxBarHeight;
        bar.style.width = `${barWidth}px`;
        bar.style.height = `${normalizedHeight}px`;
        bar.style.backgroundColor = colors[index];
        bar.style.transition = "height 0.3s, background-color 0.3s";

        // Tooltip on hover
        bar.addEventListener("mouseover", (event) => {
            tooltip.style.display = "block";
            tooltip.innerHTML = `Customer ${parseInt(customer) + 1}<br>Turnaround Time: ${turnaroundTime === 0 ? "No data" : turnaroundTime}`;
            tooltip.style.left = `${event.pageX + 10}px`;
            tooltip.style.top = `${event.pageY + 10}px`;

            // Prevent tooltip from going outside the window
            const tooltipRect = tooltip.getBoundingClientRect();
            const screenWidth = window.innerWidth;
            const screenHeight = window.innerHeight;

            // Adjust tooltip position if it's too close to the edge of the screen
            if (tooltipRect.right > screenWidth) {
                tooltip.style.left = `${event.pageX - tooltipRect.width - 10}px`;
            }
            if (tooltipRect.bottom > screenHeight) {
                tooltip.style.top = `${event.pageY - tooltipRect.height - 10}px`;
            }
        });

        bar.addEventListener("mouseleave", () => {
            tooltip.style.display = "none";
        });

        // Add label below the bar
        const label = document.createElement("div");
        label.classList.add("bar-label");
        label.style.textAlign = "center";
        label.style.marginTop = "5px";
        label.style.fontSize = "12px";
        label.innerText = `C${parseInt(customer) + 1}`;

        // Container for bar and label
        const barContainer = document.createElement("div");
        barContainer.style.display = "flex";
        barContainer.style.flexDirection = "column";
        barContainer.style.alignItems = "center";
        barContainer.style.marginRight = "5px";

        barContainer.appendChild(bar);
        barContainer.appendChild(label);

        barGraphContainer.appendChild(barContainer);
    });
}




function Calculate() {

    var queuingModel = document.getElementById("queuing-model").value;
    document.getElementById("calculations").style.display = "block";
    document.getElementById("bargraph").style.display = "block";
    document.getElementById("simulation_table").style.display = "block";


    if (queuingModel === "M/M/1") {

        generate_MM1_Table();
    }

    if (queuingModel === "M/M/2") {
        generate_MM2_Table();

    }

    if (queuingModel === "M/G/1") {
        generate_MG1_Table();

    }

    if (queuingModel === "M/G/2") {
        generate_MG2_Table();
    }

    if (queuingModel === "G/G/1") {
        generate_GG1_Table();
    }

    if (queuingModel === "G/G/2") {
        generate_GG2_Table();
    }

}
document.getElementById("calculate-btn").addEventListener("click", () => {
    const queuingModel = document.getElementById("queuing-model").value;
    const numberOfServers = parseInt(document.getElementById("numServers").value, 10);


    // Initially hide all charts and utilization sections
    document.getElementById("mm1GanttChart").style.display = "none";
    document.getElementById("mm2GanttChart").style.display = "none";
    document.getElementById("mm1Utilization").style.display = "none";
    document.getElementById("mm2Utilization").style.display = "none";

    // Show relevant chart and utilization section based on selected queuing model
    if (queuingModel === "M/M/1" || queuingModel === "M/G/1" || queuingModel === "G/G/1") {
        // Show MM1 Gantt Chart and Utilization
        document.getElementById("mm1GanttChart").style.display = "block";
        document.getElementById("mm1Utilization").style.display = "block";
        document.getElementById("calculations").style.marginTop = "7%";

    } else if (queuingModel === "M/M/2" || queuingModel === "M/G/2" || queuingModel === "G/G/2") {
        // Show MM2 Gantt Chart and Utilization
        document.getElementById("mm2GanttChart").style.display = "block";
        document.getElementById("mm2Utilization").style.display = "block";

        // Determine marginTop based on number of servers
        let marginTopValue = "20%"; // Default margin top for 2 servers

        if (numberOfServers === 3) {
            marginTopValue = "35%";
        } else if (numberOfServers === 4) {
            marginTopValue = "50%";
        } else if (numberOfServers === 5) {
            marginTopValue = "60%";
        }

        // Set the marginTop dynamically
        document.getElementById("calculations").style.marginTop = marginTopValue;
    }

});

