/**
 * Created by Karina on 22.04.2018.
 */
"use strict";
/*
 google.charts.load('current', {packages: ['corechart']});
 google.charts.setOnLoadCallback(drawChart);


 function drawChart() {

 let data = google.visualization.arrayToDataTable([
 ['Task', 'Hours pe Day'],
 ['Work', 0],
 ['Eat', 50],
 ['Commute', 0],
 ['Watch TV', 0],
 ['Sleep', 50]
 ]);

 let options = {
 title: ''
 };

 let chart = new google.visualization.PieChart(document.getElementById('piechart'));

 chart.draw(data, options);
 }
 */
let companiesArr = [];

function hideLoader() {
    $(".preloader").hide();
}

//Data loading is happening too fast. This function is to show the work loader
const asyncHider = () => {
    const timer = setTimeout(() => {
        hideLoader();
        clearTimeout(timer)
    }, 200)
};

let countries = [];

function parseCompany(companiesArr) {
    companiesArr.forEach((company) => {
        if (countries.every(country => company.location.name !== country)) {
            countries.push(company.location.name)
        }
    });
}
let companies = [];
function arrAllCompanies(arrCompanies) {
    arrCompanies.forEach((company) => {
        companies.push(company.name);
    });
    for (let i = 0; i <= companies.length - 1; i++) {
        let div = $("<a class='each-companies' href='#'></a>");
        div.append(companies[i]);
        $(".list-all-companies").after(div);

    }
    showCompanyPartners();
}
let arrCompanyPartners = [];

function showCompanyPartners() {
    $(".each-companies").on("click", function () {
        $(".company-partners").css("display", "flex");
        const companyName = $(this).text();
        arrCompanyPartners = _.find(companiesArr, ['name', companyName]).partners;
    })

}
$(document).ready(
    $.ajax({
            type: "Get",
            url: "http://codeit.pro/codeitCandidates/serverFrontendTest/company/getList",
            success: res => {
                console.log(res);
                companiesArr = res.list;
                parseCompany(companiesArr);
                asyncHider();
                arrAllCompanies(res.list);
                const countOfCompanies = res.list.length;
                $("#circle-all-companies").html(countOfCompanies);

            }

        }
    )
)
$(document).ready(
    $.ajax({
            type: "Get",
            url: "http://codeit.pro/codeitCandidates/serverFrontendTest/news/getList",
            success: res => {
                console.log(res)
            }
        }
    )
)

