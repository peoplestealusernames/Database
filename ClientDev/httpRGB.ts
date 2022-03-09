import { get, post, put } from "request";

function CallBack(error: any, response: { statusCode: number; }, body: any) {
    if (!error && response.statusCode == 200) {
        console.log(body);
    }
}

put(
    'http://localhost:5000/api/data',
    { json: { RGB: { r: 245, g: 255, b: 225 } } },
    CallBack
);

get(
    'http://localhost:5000/api/data/RGB',
    CallBack
)