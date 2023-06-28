
import { post } from '@/utils/request/dbRequest'
export async function translate<T = any>(
    params: {
        query: string
    },
) {
    try {
        const response = post<T>({
            url: '/translate',
            data: { query: params.query},
        })
        return response;
    } catch (error) {
        console.log("mjSubmitImagine->error,",error);
        return error;
    }
}



// async translate() {
//     try {


//       const res = await axios.post('http://localhost:3000/translate', {
//         query: this.query,
//         from: 'auto',
//         to: 'zh'
//       });
//       this.translation = res.data.trans_result[0].dst;
//     } catch (err) {
//       console.error(err);
//     }
//   }