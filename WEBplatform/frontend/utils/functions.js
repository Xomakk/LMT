import { getAuthToken } from "@/components/auth";
import { endpoint } from "./constants";

export function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
};


export function setCookie(name, value, options = {}) {

    options = {
        path: '/',
        // при необходимости добавьте другие значения по умолчанию
        ...options
    };

    if (options.expires instanceof Date) {
        options.expires = options.expires.toUTCString();
    }

    let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);

    for (let optionKey in options) {
        updatedCookie += "; " + optionKey;
        let optionValue = options[optionKey];
        if (optionValue !== true) {
          updatedCookie += "=" + optionValue;
        }
    }

    document.cookie = updatedCookie;
};


export function deleteCookie(name) {
    setCookie(name, "", {
        'max-age': -1
    })
};

export const getFullName = (object) => {
    return `${object.lastname} ${object.name} ${object.patronymic}`
};


export const fetchData = async ({point, data, method}) => {
    const token = getAuthToken()
    var result = 'none'

    if (!!token) {
      var myHeaders = new Headers();
          myHeaders.append("Cookie", getCookie("csrftoken"));
          myHeaders.append("Authorization", `Token ${token}`);
          myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify(data)

      var requestOptions = {
              method: method,
              headers: myHeaders,
              body: raw
          };
  
      const response = await fetch(`${endpoint}/${point}/`, requestOptions);

      result = response
    } else {
      result = 'ERROR. Token is not defined.'
    }

    return result;
};


// скачивание отчета в xlsx
export const downloadReport = (point) => {
    fetchData({
        point: point,
        method: 'GET'
    }).then((res) => {
        return res.blob();
    })
    .then((blob) => {
        const href = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = href;
        link.setAttribute('download', 'report.xlsx'); //or any other extension
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    })
    .catch((err) => {
        return Promise.reject({ Error: 'Something Went Wrong', err });
    })
}