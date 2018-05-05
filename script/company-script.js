/**
 * Created by Karina on 22.04.2018.
 */
"use strict";
let arrCompanyPartners,
    companiesArr,
    countries,
    sortedPartnersValue = [];

const SortingTypes = {
    VALUE_UP: 'VALUE_UP',
    VALUE_DOWN: 'VALUE_DOWN',
    NAME_DOWN: 'NAME_DOWN',
    NAME_UP: 'NAME_UP'
};

let sortingType = SortingTypes.VALUE_DOWN;
function parseCompany(companiesArr) {
    companiesArr.forEach((company) => {
        if (countries.every(country => company.location.name)) {
            countries.push(company.location.name)
        }
    });
}
//diagram
function showDiagram(dataCountry) {
    let arrCountry = [];
    let countCountry;
    for (let i = 0; i <= dataCountry.length - 1; i++) {
        arrCountry.push(dataCountry[i].location.name);
        countCountry = _.countBy(arrCountry, _.uniq);
    }
    arrCountry = _.sortBy(arrCountry);
    const data = {
        series: [5, 3, 4, 2, 1, 2]
    };
    const sum = (a, b)=> a + b;
    new Chartist.Pie('.diagram', data, {
            labelInterpolationFnc: value => Math.round(value / data.series.reduce(sum) * 100) + '%'
        }
    );
}
function hideLoader() {
    $(".preloader").hide();
}

//Data loading is happening too fast. This function is to show the work loader
const asyncHider = () => {
    const timer = setTimeout(() => {
        hideLoader();
        clearTimeout(timer)
    }, 1000)
};

function createAllCompaniesBlock(arrCompanies) {
    arrCompanies.forEach((company, i) => {
        const link = $("<a class='each-companies' href='#'></a>").attr("data-id", i);
        link.append(company.name);
        $(".list-all-companies").after(link);
    });
    $(".each-companies").on("click", function () {
        showCompanyPartners(this);
    })
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
        const companyPartner = $("<div class='partner'></div>");
        $(".list-partner").after(companyPartner);
        companyPartner.append(`${item.name} - ${item.value}%`);
    })
}
function getCompanyPartners(_this) {
    $(".company-partners").addClass("company-partners-display");
    const partners = companiesArr[$(_this).attr("data-id")].partners;
    arrCompanyPartners = getPartnersInPercentage(partners);
}

function getPartnersInPercentage(arr) {
    const sumValue = _.sumBy(arr, 'value')
    return arr.map(item => ({'name': item.name, 'value': Number((item.value / sumValue * 100).toFixed(1))}))
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
                console.log(res)
                companiesArr = res.list;
                // parseCompany(companiesArr);
                asyncHider();
                createAllCompaniesBlock(res.list);
                showDiagram(res.list);
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

function showImage(adress) {
    $(".first-img").attr('src', adress[0].img);
}

function showTitleNews(address) {
    $(".title-first").attr('href', address[0].link);
}
function showDescriptionNews(adress) {
    let arrDeskription = [];
    arrDeskription = adress[0].description.split('');
    if (arrDeskription.length > 50) {
        let shortArr;
        arrDeskription.length = 50;
        shortArr = arrDeskription;

        $(".description-news").html(shortArr.join('') + "...");
    }
    else $(".description-news").html(arrDeskription);

}

function showAuthor(adress) {
    $(".author").html("Author:" + adress[0].author);

}
function showPublic(adress) {
    let datePublick = moment.unix(adress[0].date).format("DD.MM.YYYY");
    $(".public").html("Public:" + datePublick);


}
function getNews() {
    $.ajax({
            type: "Get",
            url: "http://codeit.pro/codeitCandidates/serverFrontendTest/news/getList",
            success: res => {
                showImage(res.list);
                showTitleNews(res.list);
                showDescriptionNews(res.list);
                showAuthor(res.list);
                showPublic(res.list);
            }
        }
    )
}
$(function () {
    getCompanies();
    getNews();
    addEventListenerForArrows();
})


