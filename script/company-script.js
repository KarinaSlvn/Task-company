/**
 * Created by Karina on 22.04.2018.
 */
"use strict";
let arrCompanyPartners = [];
let sortedPartnersValue = [];

const SortingTypes = {
    VALUE_UP: 'VALUE_UP',
    VALUE_DOWN: 'VALUE_DOWN',
    NAME_DOWN: 'NAME_DOWN',
    NAME_UP: 'NAME_UP'
};

let sortingType = SortingTypes.VALUE_DOWN;
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
    }, 1)
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
        let a = $("<a class='each-companies' href='#'></a>");
        a.append(companies[i]);
        $(".list-all-companies").after(a);

    }
    $(".each-companies").on("click", function () {
        showCompanyPartners(this);
    })
    // showCompanyPartners();
}

function changeSortingType(type) {
    sortingType = type
}

function getOrder(sortType) {
    return sortType === SortingTypes.VALUE_DOWN || sortType === SortingTypes.NAME_DOWN ? 'asc' : 'desc'
}

function getSortBy(sortType) {
    return sortType === SortingTypes.VALUE_DOWN || sortType === SortingTypes.VALUE_UP ? 'value' : 'name'
}

function getSortedArr(arr, sortType) {
    return sortedPartnersValue = _.orderBy(arr, [getSortBy(sortType)], [getOrder(sortType)]);
}
function constructorPartnersBlock() {
    $(".partner").remove();
    getSortedArr(arrCompanyPartners, sortingType).forEach(item => {
        console.log(item)
        const companyPartner = $("<div class='partner'></div>");
        $(".list-partner").after(companyPartner);
        companyPartner.append(`${item.name} - ${item.value}%`);
    })
}

function getCompanyPartners(_this) {
    $(".company-partners").css("display", "flex");
    const companyName = $(_this).text();
    arrCompanyPartners = getPartnersInPercentage(_.find(companiesArr, ['name', companyName]).partners);
}
function getPartnersInPercentage(arr) {
    const sumValue = _.sumBy(arr, 'value')
    return arr.map(item => {
        return {'name': item.name, 'value': Number((item.value / sumValue * 100).toFixed(1))}
    })
}

function showCompanyPartners(_this) {
    getCompanyPartners(_this);
    constructorPartnersBlock();
}

function getCompanies() {
    $.ajax({
            type: "Get",
            url: "http://codeit.pro/codeitCandidates/serverFrontendTest/company/getList",
            success: res => {
                companiesArr = res.list;
                parseCompany(companiesArr);
                asyncHider();
                arrAllCompanies(res.list);
                const countOfCompanies = res.list.length;
                $("#circle-all-companies").html(countOfCompanies);

            }

        }
    )
}

function addEventListenerForArrows() {
    const ArrowsSort = [
        {
            className: 'sort-value-down',
            sort: SortingTypes.VALUE_DOWN
        },
        {
            className: 'sort-value-up',
            sort: SortingTypes.VALUE_UP
        },
        {
            className: 'sort-name-down',
            sort: SortingTypes.NAME_DOWN
        },
        {
            className: 'sort-name-up',
            sort: SortingTypes.NAME_UP
        }
    ];
    ArrowsSort.forEach(arrow => {
        $('.' + arrow.className).on("click", function () {
            changeSortingType(arrow.sort)
            constructorPartnersBlock()
        })
    })
}
function getNews() {
    $.ajax({
            type: "Get",
            url: "http://codeit.pro/codeitCandidates/serverFrontendTest/news/getList",
            success: res => {
            }
        }
    )
}
$(function () {
    getCompanies();
    getNews();
    addEventListenerForArrows();
})


