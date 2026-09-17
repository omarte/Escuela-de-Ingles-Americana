import React, { useState } from 'react'
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Share,
  Platform,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { colors, spacing, typography, radius, Badge } from '@elp/ui'
import type { CheckpointDefinition, CheckpointProgressState } from '@elp/types'
import { useEvaluationStore } from '../stores/useEvaluationStore'
import { useAuthStore } from '../stores/useAuthStore'

interface AcademicRecordModalProps {
  visible: boolean
  wordsMasteredCount: number
  onClose: () => void
  onStartExam: (checkpoint: CheckpointDefinition) => void
}

export function AcademicRecordModal({
  visible,
  wordsMasteredCount,
  onClose,
  onStartExam,
}: AcademicRecordModalProps): React.JSX.Element | null {
  const user = useAuthStore((state) => state.user)
  const profile = useAuthStore((state) => state.profile)

  const getAllCheckpointsState = useEvaluationStore((state) => state.getAllCheckpointsState)
  const getAcademicSummary = useEvaluationStore((state) => state.getAcademicSummary)

  const [selectedCert, setSelectedCert] = useState<{
    checkpoint: CheckpointDefinition
    score: number
    hash: string
    date: string
  } | null>(null)

  if (!visible) return null

  const studentName = profile?.displayName || user?.email?.split('@')[0] || 'Estudiante Oficial'
  const studentId = `EIA-${(user?.id || 'DEMO').substring(0, 8).toUpperCase()}`
  const checkpointsState = getAllCheckpointsState(wordsMasteredCount)
  const summary = getAcademicSummary(wordsMasteredCount)

  const handleShareCertificate = async (cert: {
    checkpoint: CheckpointDefinition
    score: number
    hash: string
  }): Promise<void> => {
    try {
      await Share.share({
        message: `🎓 Certificado Oficial de Aprobación — Escuela de Inglés Americana 🇺🇸
📜 Hito: ${cert.checkpoint.title}
👤 Estudiante: ${studentName}
📊 Calificación: ${cert.score}% (Aprobado)
🔐 Código de Verificación Oficial: ${cert.hash}

¡Formación en inglés basada en ciencia cognitiva y repetición espaciada!`,
        title: `Certificado Oficial EIA - ${cert.checkpoint.title}`,
      })
    } catch {
      // User dismissed
    }
  }

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <SafeAreaView style={styles.modalSafe} edges={['top', 'bottom']}>
        {/* Header Oficial Institucional */}
        <View style={styles.officialHeader}>
          <TouchableOpacity onPress={onClose} style={styles.exitButton} accessibilityLabel="Cerrar boleta">
            <Ionicons name="close" size={22} color={colors.textPrimary} />
          </TouchableOpacity>

          <View style={styles.headerTitleWrap}>
            <Text style={styles.schoolName}>ESCUELA DE INGLÉS AMERICANA</Text>
            <Text style={styles.documentTitle}>Boleta Oficial de Calificaciones</Text>
          </View>

          <View style={{ width: 36 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Tarjeta de Matrícula del Alumno */}
          <View style={styles.studentCard}>
            <View style={styles.studentIconWrap}>
              <Text style={styles.studentEmoji}>🎓</Text>
            </View>

            <View style={styles.studentInfo}>
              <Text style={styles.studentNameText}>{studentName}</Text>
              <View style={styles.studentMetaRow}>
                <Text style={styles.studentMetaLabel}>Matrícula: <Text style={styles.studentMetaVal}>{studentId}</Text></Text>
                <Text style={styles.studentMetaLabel}>Nivel: <Text style={styles.studentMetaVal}>{profile?.currentLevel || 'A1'}</Text></Text>
              </View>
            </View>
          </View>

          {/* Resumen de Desempeño Académico */}
          <View style={styles.summaryGrid}>
            <View style={styles.summaryBox}>
              <Text style={styles.summaryVal}>
                {summary.averageScore > 0 ? `${summary.averageScore}%` : '—'}
              </Text>
              <Text style={styles.summaryLabel}>Promedio General</Text>
            </View>

            <View style={styles.summaryBox}>
              <Text style={[styles.summaryVal, { color: '#059669' }]}>
                {summary.passedCount}/{summary.totalCheckpoints}
              </Text>
              <Text style={styles.summaryLabel}>Checkpoints</Text>
            </View>

            <View style={styles.summaryBox}>
              <Text style={[styles.summaryVal, { color: '#2563EB' }]}>
                {summary.averageLatencyMs > 0 ? `${(summary.averageLatencyMs / 1000).toFixed(1)}s` : '—'}
              </Text>
              <Text style={styles.summaryLabel}>Latencia Media</Text>
            </View>

            <View style={styles.summaryBox}>
              <Text style={[styles.summaryVal, { color: '#B45309' }]}>
                {summary.certificatesCount}
              </Text>
              <Text style={styles.summaryLabel}>Diplomas</Text>
            </View>
          </View>

          {/* Listado de Checkpoints de Progreso */}
          <Text style={styles.sectionHeader}>HITOS CURRICULARES Y EXÁMENES</Text>

          <View style={styles.checkpointsList}>
            {checkpointsState.map((item) => {
              const cp = item.checkpoint
              const isPassed = item.status === 'passed'
              const isAvailable = item.status === 'available'
              const isFailed = item.status === 'failed'
              const isLocked = item.status === 'locked'

              return (
                <View
                  key={cp.id}
                  style={[
                    styles.checkpointRow,
                    isPassed && styles.checkpointRowPassed,
                    isAvailable && styles.checkpointRowAvailable,
                  ]}
                >
                  <View style={styles.cpIconWrap}>
                    <Text style={styles.cpEmoji}>{cp.badgeEmoji}</Text>
                  </View>

                  <View style={styles.cpInfo}>
                    <View style={styles.cpTitleRow}>
                      <Text style={styles.cpTitle} numberOfLines={1}>
                        {cp.title}
                      </Text>
                      <Badge
                        label={
                          isPassed
                            ? `${item.bestScorePercentage}% Aprobado`
                            : isFailed
                              ? 'Reintentar'
                              : isAvailable
                                ? 'Disponible'
                                : `Req. ${cp.requiredWords} pal.`
                        }
                        color={
                          isPassed
                            ? '#059669'
                            : isFailed
                              ? '#DC2626'
                              : isAvailable
                                ? '#2563EB'
                                : '#64748B'
                        }
                        size="sm"
                      />
                    </View>

                    <Text style={styles.cpSubtitle} numberOfLines={2}>
                      {cp.subtitle}
                    </Text>

                    {/* Acciones y Credenciales */}
                    {isPassed && item.certificateHash ? (
                      <TouchableOpacity
                        style={styles.certPillBtn}
                        onPress={() =>
                          setSelectedCert({
                            checkpoint: cp,
                            score: item.bestScorePercentage || 100,
                            hash: item.certificateHash!,
                            date: item.passedAt || new Date().toISOString(),
                          })
                        }
                      >
                        <Ionicons name="ribbon-outline" size={13} color="#B45309" />
                        <Text style={styles.certPillText}>Ver Credencial Oficial: {item.certificateHash}</Text>
                      </TouchableOpacity>
                    ) : isAvailable || isFailed ? (
                      <TouchableOpacity
                        style={styles.takeExamBtn}
                        onPress={() => {
                          onClose()
                          onStartExam(cp)
                        }}
                      >
                        <Ionicons name="play-circle" size={15} color="#FFFFFF" />
                        <Text style={styles.takeExamBtnText}>
                          {isFailed ? 'Presentar Nuevo Intento' : 'Presentar Examen'}
                        </Text>
                      </TouchableOpacity>
                    ) : (
                      <Text style={styles.lockedHintText}>
                        🔒 Dominadas {wordsMasteredCount} de {cp.requiredWords} palabras requeridas
                      </Text>
                    )}
                  </View>
                </View>
              )
            })}
          </View>
        </ScrollView>

        {/* Modal de Vista de Certificado Oficial */}
        {selectedCert ? (
          <Modal visible={true} transparent={true} animationType="fade" onRequestClose={() => setSelectedCert(null)}>
            <View style={styles.certModalOverlay}>
              <View style={styles.certDiplomaSheet}>
                <View style={styles.diplomaHeader}>
                  <Text style={styles.diplomaSchool}>ESCUELA DE INGLÉS AMERICANA</Text>
                  <Text style={styles.diplomaTitle}>CERTIFICADO DE APROBACIÓN</Text>
                </View>

                <View style={styles.diplomaBody}>
                  <Text style={styles.diplomaAwardedTo}>Se certifica que:</Text>
                  <Text style={styles.diplomaStudentName}>{studentName}</Text>
                  <Text style={styles.diplomaReason}>
                    ha demostrado dominio cognitivo verificable al aprobar el hito curricular:
                  </Text>
                  <Text style={styles.diplomaCheckpointName}>{selectedCert.checkpoint.title}</Text>
                  <Text style={styles.diplomaScore}>Calificación Obtenida: {selectedCert.score}%</Text>

                  <View style={styles.diplomaHashBox}>
                    <Text style={styles.diplomaHashLabel}>REGISTRO Y FIRMA DE VALIDACIÓN DIGITAL</Text>
                    <Text style={styles.diplomaHashValue}>{selectedCert.hash}</Text>
                  </View>
                </View>

                <View style={styles.diplomaActions}>
                  <TouchableOpacity
                    style={styles.diplomaShareBtn}
                    onPress={() => void handleShareCertificate(selectedCert)}
                  >
                    <Ionicons name="share-social" size={18} color="#FFFFFF" />
                    <Text style={styles.diplomaShareBtnText}>Compartir Diploma Oficial</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.diplomaCloseBtn}
                    onPress={() => setSelectedCert(null)}
                  >
                    <Text style={styles.diplomaCloseBtnText}>Cerrar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        ) : null}
      </SafeAreaView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalSafe: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  officialHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  exitButton: {
    padding: spacing.xs,
    borderRadius: radius.full,
    backgroundColor: '#F1F5F9',
  },
  headerTitleWrap: {
    alignItems: 'center',
  },
  schoolName: {
    fontSize: 10,
    fontWeight: '800',
    color: '#1D4ED8',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  documentTitle: {
    fontSize: typography.sizes.sm + 1,
    fontWeight: typography.weights.bold,
    color: '#0F172A',
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  studentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: spacing.md,
  },
  studentIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  studentEmoji: {
    fontSize: 24,
  },
  studentInfo: {
    flex: 1,
  },
  studentNameText: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: '#0F172A',
  },
  studentMetaRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: 2,
  },
  studentMetaLabel: {
    fontSize: typography.sizes.xs,
    color: '#64748B',
  },
  studentMetaVal: {
    fontWeight: typography.weights.bold,
    color: '#334155',
  },
  summaryGrid: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: spacing.lg,
  },
  summaryBox: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  summaryVal: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: '#0F172A',
  },
  summaryLabel: {
    fontSize: 9,
    color: '#64748B',
    fontWeight: typography.weights.medium,
    marginTop: 2,
    textAlign: 'center',
  },
  sectionHeader: {
    fontSize: typography.sizes.xs,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
  },
  checkpointsList: {
    gap: spacing.sm,
  },
  checkpointRow: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.md,
    padding: spacing.md,
    flexDirection: 'row',
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  checkpointRowPassed: {
    borderColor: '#A7F3D0',
    borderLeftWidth: 4,
    borderLeftColor: '#059669',
  },
  checkpointRowAvailable: {
    borderColor: '#BFDBFE',
    borderLeftWidth: 4,
    borderLeftColor: '#2563EB',
  },
  cpIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cpEmoji: {
    fontSize: 20,
  },
  cpInfo: {
    flex: 1,
  },
  cpTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
    gap: 4,
  },
  cpTitle: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: '#0F172A',
    flex: 1,
  },
  cpSubtitle: {
    fontSize: typography.sizes.xs,
    color: '#64748B',
    marginBottom: 6,
    lineHeight: 16,
  },
  certPillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFBEB',
    borderColor: '#FDE68A',
    borderWidth: 1,
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    alignSelf: 'flex-start',
  },
  certPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#B45309',
  },
  takeExamBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#2563EB',
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 6,
    alignSelf: 'flex-start',
  },
  takeExamBtnText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: '#FFFFFF',
  },
  lockedHintText: {
    fontSize: typography.sizes.xs - 1,
    color: '#94A3B8',
    fontStyle: 'italic',
  },
  // Diploma Modal
  certModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
  },
  certDiplomaSheet: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.xl,
    padding: spacing.lg,
    width: '100%',
    maxWidth: 420,
    borderWidth: 3,
    borderColor: '#D97706',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  diplomaHeader: {
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#FDE68A',
    paddingBottom: spacing.sm,
    marginBottom: spacing.md,
  },
  diplomaSchool: {
    fontSize: 11,
    fontWeight: '900',
    color: '#1D4ED8',
    letterSpacing: 1.5,
  },
  diplomaTitle: {
    fontSize: typography.sizes.md,
    fontWeight: '800',
    color: '#B45309',
    marginTop: 2,
  },
  diplomaBody: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  diplomaAwardedTo: {
    fontSize: typography.sizes.xs,
    color: '#64748B',
    marginBottom: 4,
  },
  diplomaStudentName: {
    fontSize: typography.sizes.lg,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 6,
    textAlign: 'center',
  },
  diplomaReason: {
    fontSize: typography.sizes.xs,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 4,
  },
  diplomaCheckpointName: {
    fontSize: typography.sizes.sm + 1,
    fontWeight: typography.weights.bold,
    color: '#047857',
    textAlign: 'center',
    marginBottom: 4,
  },
  diplomaScore: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: '#0F172A',
    marginBottom: spacing.md,
  },
  diplomaHashBox: {
    backgroundColor: '#FFFBEB',
    borderColor: '#FDE68A',
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.sm,
    width: '100%',
    alignItems: 'center',
  },
  diplomaHashLabel: {
    fontSize: 8,
    fontWeight: '800',
    color: '#B45309',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  diplomaHashValue: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: '#78350F',
    letterSpacing: 1,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  diplomaActions: {
    gap: spacing.sm,
  },
  diplomaShareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#D97706',
    borderRadius: radius.md,
    paddingVertical: spacing.sm + 2,
  },
  diplomaShareBtnText: {
    color: '#FFFFFF',
    fontWeight: typography.weights.bold,
    fontSize: typography.sizes.sm,
  },
  diplomaCloseBtn: {
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  diplomaCloseBtnText: {
    color: '#64748B',
    fontWeight: typography.weights.semibold,
    fontSize: typography.sizes.sm,
  },
})
