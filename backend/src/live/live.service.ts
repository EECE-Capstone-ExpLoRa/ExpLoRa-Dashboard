import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { HttpService } from '@nestjs/axios';
import { map, catchError } from 'rxjs';


@Injectable()
export class LiveService {
  constructor(private readonly http: HttpService) {}

  async handle(body) {
    console.log(body);
    if ('enableUrl' in body) {
      console.log("This is a confirmation message");
      // let data = await this.http.axiosRef.get(body.enableUrl, {
      //   params: {
      //     confirmationToken: body.confirmationToken
      //   }
      // });
    } else {
      console.log("This is a data message");
      
    }

  }
}

// {
//   arn: 'arn:aws:iot:us-east-1:932767054117:ruledestination/http/d63a5932-2605-4615-94f0-59595b487be0',
//   confirmationToken: 'AYADeAHEe8w3CcDuIH3JWTlD8jwAXwABABVhd3MtY3J5cHRvLXB1YmxpYy1rZXkAREFoam9qTnkrWjVnUkIwWFI4RXVQcS8zRFlQdjV6NTlUNGhJZ2oxVmtoaXNPY0gwQzV1eFBBKzkxM0NyZXhtakN5dz09AAEAB2F3cy1rbXMAS2Fybjphd3M6a21zOnVzLWVhc3QtMTo5ODc5NTE4NTI0OTk6a2V5L2U4YmU3ODViLTU5NWMtNDcxYi1iOWJmLWQ2Y2I4ZjQxODlmNwC4AQIBAHicX2l2iARP_9nWE0xc-pc-Fy34EUNQWsflMG0sDhV1WgHUov4hvK9lzsXrpk27V_kSAAAAfjB8BgkqhkiG9w0BBwagbzBtAgEAMGgGCSqGSIb3DQEHATAeBglghkgBZQMEAS4wEQQMOU6qZoDPpW2YSU-EAgEQgDuZ0wHwIn4kLLgZzYEJ5wrjvw4MKg2Hv3NbV3zNj35SPvvle1xSM6Wm_AK0XXq6Nc9q1j93KWLC77n9jwIAAAAADAAAEAAAAAAAAAAAAAAAAABBNNqCW3-jP3g8bHbzAXBZ_____wAAAAEAAAAAAAAAAAAAAAEAAAB1X5lZ3Dppt3a3OvymTUdOGdYWzYGmvaMExWt3M5HVTHczGP_RPpiXqkYEhyKcVGxFoGVe0HaXTxCff9t4SQoT92xAkdEq4-8JhxPcly2iB-oEpBj_Ez8W2gDLV_M2lxCtOalB_W7rvVhrBW_Xgv_0tirBOwMzsaOwne60kpT6ydeyKVROnwBnMGUCMQC1jIKkRqLhhNlTQgvi9D0U_t98Q46ztzoae7fl-AfVuc4nbg-NnDLxXkec8mfLa7QCMG_KJ6xjuW94u2tpzVWjVPEgoSqjo-41QexFwGlLjmNM-jFAxW9KTW3_Czl7-I22SA',
//   enableUrl: 'https://iot.us-east-1.amazonaws.com/confirmdestination/AYADeAHEe8w3CcDuIH3JWTlD8jwAXwABABVhd3MtY3J5cHRvLXB1YmxpYy1rZXkAREFoam9qTnkrWjVnUkIwWFI4RXVQcS8zRFlQdjV6NTlUNGhJZ2oxVmtoaXNPY0gwQzV1eFBBKzkxM0NyZXhtakN5dz09AAEAB2F3cy1rbXMAS2Fybjphd3M6a21zOnVzLWVhc3QtMTo5ODc5NTE4NTI0OTk6a2V5L2U4YmU3ODViLTU5NWMtNDcxYi1iOWJmLWQ2Y2I4ZjQxODlmNwC4AQIBAHicX2l2iARP_9nWE0xc-pc-Fy34EUNQWsflMG0sDhV1WgHUov4hvK9lzsXrpk27V_kSAAAAfjB8BgkqhkiG9w0BBwagbzBtAgEAMGgGCSqGSIb3DQEHATAeBglghkgBZQMEAS4wEQQMOU6qZoDPpW2YSU-EAgEQgDuZ0wHwIn4kLLgZzYEJ5wrjvw4MKg2Hv3NbV3zNj35SPvvle1xSM6Wm_AK0XXq6Nc9q1j93KWLC77n9jwIAAAAADAAAEAAAAAAAAAAAAAAAAABBNNqCW3-jP3g8bHbzAXBZ_____wAAAAEAAAAAAAAAAAAAAAEAAAB1X5lZ3Dppt3a3OvymTUdOGdYWzYGmvaMExWt3M5HVTHczGP_RPpiXqkYEhyKcVGxFoGVe0HaXTxCff9t4SQoT92xAkdEq4-8JhxPcly2iB-oEpBj_Ez8W2gDLV_M2lxCtOalB_W7rvVhrBW_Xgv_0tirBOwMzsaOwne60kpT6ydeyKVROnwBnMGUCMQC1jIKkRqLhhNlTQgvi9D0U_t98Q46ztzoae7fl-AfVuc4nbg-NnDLxXkec8mfLa7QCMG_KJ6xjuW94u2tpzVWjVPEgoSqjo-41QexFwGlLjmNM-jFAxW9KTW3_Czl7-I22SA',
//   messageType: 'DestinationConfirmation'
// }
