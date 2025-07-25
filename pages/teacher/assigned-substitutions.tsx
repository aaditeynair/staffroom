
import pageAuth from "@/components/auth/pageAuth"
import { supabase } from "@/lib/supabaseClient";
import { useState, useEffect } from "react";
import TeacherNavMobile from "@/components/teachers/teacherNavMobile"
import Header from "@/components/ui/header"
import { CheckRounded, ClearRounded, WidthFull } from "@mui/icons-material";
import { Button } from "@mui/material";
import ConfirmDialog from "@/components/ui/Confirmdialog";

type Substitution = {
    id:string;
    date: string;
    period_number: number;
    class: string;
}
function AssignedSubstitutions() {
    const [loading, setLoading] = useState(true)
    const [substitution, setSubstitution] = useState<Substitution[]>([])
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState<'accept' | 'decline'>('accept');
    const [selectedSub, setSelectedSub] = useState<Substitution | null>(null);

    useEffect(() => {
        const fetchAbsences = async () => {
            setLoading(true)
            const {
                data: { session },
            } = await supabase.auth.getSession()

            if (!session?.user?.email) return
            const { data: teacher } = await supabase
                .from('teachers')
                .select('id')
                .eq('email', session.user.email)
                .single()

            if (!teacher) return

            const { data, error } = await supabase
                .from('substitutions')
                .select('id,date,period_number,class')
                .eq('substitute_teacher', teacher.id)
                .order('date')


            if (data) setSubstitution(data)
            setLoading(false)
        }

        fetchAbsences()

    }, [])
    const handleOpenAccept = (sub: Substitution) => {
        setSelectedSub(sub)
        setDialogMode('accept');
        setDialogOpen(true);
    };

    const handleOpenDecline = (sub: Substitution) => {
        setSelectedSub(sub)
        setDialogMode('decline');
        setDialogOpen(true);
    };

    const handleDecision = async (accepted: boolean, reason?: string) => {
        if (!selectedSub) return;

        const { error } = await supabase
            .from('substitutions')
            .update({ confirmed_by_teacher: accepted,reason:reason })
            .eq('id', selectedSub.id);

        if (error) {
            console.error('Failed to update confirmation:', error.message);
        }
        setDialogOpen(false);
        setSelectedSub(null);
    };
    return (
        <div>
            <Header heading="Assigned Substitutions" />
            <div className="min-h-screen max-w-screen flex flex-col bg-gray-200 p-4">
                <div className="max-w-screen bg-gray-100 p-5 rounded-md shadow">
                    <h2 className="text-2xl font-bold text-teal-800 mb-6">Assigned Substitutions</h2>
                    {!loading
                        ? <table className="border-separate border-spacing-y-3 min-w-full mt-4 overflow-hidden rounded-md align text-left">
                            <thead>
                                <tr className="bg-gray-200">
                                    <th className="p-2">Date</th>
                                    <th className="p-2">Period</th>
                                    <th className="p-2">Class</th>
                                    <th className="p-2">Confirm</th>
                                </tr>
                            </thead>
                            <tbody>
                                {substitution.map((substitution, index) => (
                                    <tr key={index}>
                                        <td className="p-2">{new Date(substitution.date).toDateString()}</td>
                                        <td className="p-2 text-center">{substitution.period_number}</td>
                                        <td className="p-2 text-center">{substitution.class}</td>
                                        <td className="p-2 space-x-2">
                                            <div className="flex flex-col gap-4">
                                                <Button sx={{ color: 'green', border: 1 }} onClick={() => handleOpenAccept(substitution)}><CheckRounded /></Button>
                                                <Button sx={{ color: 'red', border: 1 }} onClick={() => handleOpenDecline(substitution)}><ClearRounded /></Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        : <p> Loading... </p>
                    }
                    <ConfirmDialog
                        open={dialogOpen}
                        mode={dialogMode}
                        onClose={() => setDialogOpen(false)}
                        onConfirm={handleDecision}
                    />
                </div>
            </div>
            <TeacherNavMobile />
        </div>
    )
}
export default pageAuth(AssignedSubstitutions, 'teacher')   