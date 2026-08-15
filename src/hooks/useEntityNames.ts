import { useQuery } from "@tanstack/react-query";
import { doctorsApi } from "../api/doctors";
import { patientsApi } from "../api/patients";

export function useEntityNames() {
  const doctors = useQuery({
    queryKey: ["doctors", "all"],
    queryFn: () => doctorsApi.list({ limitPageLength: 5000 })
  });

  const patients = useQuery({
    queryKey: ["patients", "all"],
    queryFn: () => patientsApi.list({ limitPageLength: 5000 })
  });

  const getDoctorName = (id: string) => {
    if (!id) return "—";
    const doc = doctors.data?.data.find((d) => d.name === id);
    return doc?.full_name || doc?.name || id;
  };

  const getPatientName = (id: string) => {
    if (!id) return "—";
    const pat = patients.data?.data.find((p) => p.name === id);
    return pat?.name1 || pat?.name || id;
  };

  return {
    getDoctorName,
    getPatientName,
    isLoading: doctors.isLoading || patients.isLoading
  };
}
